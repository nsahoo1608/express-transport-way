"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500";

export default function NewEmployeePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    designation: "",
    department: "",
    joiningDate: "",
    employmentType: "",
    employmentStatus: "ACTIVE",
    bloodGroup: "",
    maritalStatus: "",
    spouseName: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    emergencyContactAltPhone: "",
    emergencyContactAddress: "",
  });

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to create employee."
        );
      }

      setSuccess(
        `Employee created successfully. Employee ID: ${result.data.employeeId}`
      );

      setTimeout(() => {
        router.push("/admin/employees");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create employee."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Add Employee
            </h1>

            <p className="mt-2 text-slate-400">
              Create a secure internal employee record.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/employees")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            Back to Employees
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full Name *
                </label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    updateField("fullName", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Employee full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Primary phone number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  className={inputClass}
                  placeholder="employee@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    updateField("dateOfBirth", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    updateField("gender", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Blood Group
                </label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) =>
                    updateField("bloodGroup", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  rows={3}
                  className={inputClass}
                  placeholder="Current residential address"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Employment Details</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Designation *
                </label>
                <input
                  required
                  value={form.designation}
                  onChange={(e) =>
                    updateField("designation", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g. Site Transport Coordinator"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Department
                </label>
                <input
                  value={form.department}
                  onChange={(e) =>
                    updateField("department", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g. Operations"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Joining Date *
                </label>
                <input
                  required
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) =>
                    updateField("joiningDate", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Employment Type
                </label>
                <select
                  value={form.employmentType}
                  onChange={(e) =>
                    updateField("employmentType", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select employment type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Employment Status
                </label>
                <select
                  value={form.employmentStatus}
                  onChange={(e) =>
                    updateField("employmentStatus", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="TERMINATED">Terminated</option>
                  <option value="RESIGNED">Resigned</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Family Information</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Marital Status
                </label>
                <select
                  value={form.maritalStatus}
                  onChange={(e) =>
                    updateField("maritalStatus", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select marital status</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Spouse Name
                </label>
                <input
                  value={form.spouseName}
                  onChange={(e) =>
                    updateField("spouseName", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Spouse name"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Emergency Contact</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Contact Name
                </label>
                <input
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactName",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Relationship
                </label>
                <input
                  value={form.emergencyContactRelationship}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactRelationship",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="e.g. Father, Mother, Spouse"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactPhone",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Primary emergency phone"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={form.emergencyContactAltPhone}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactAltPhone",
                      e.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Alternate emergency phone"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Emergency Contact Address
                </label>
                <textarea
                  value={form.emergencyContactAddress}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactAddress",
                      e.target.value
                    )
                  }
                  rows={3}
                  className={inputClass}
                  placeholder="Emergency contact address"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
            Employee records are confidential and accessible only to
            authorized ETW administrators.
          </div>

          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() => router.push("/admin/employees")}
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Employee..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}