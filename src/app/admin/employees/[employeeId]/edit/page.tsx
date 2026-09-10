"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EmployeeData = {
  employeeId: string;
  fullName: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  designation: string;
  department: string | null;
  joiningDate: string;
  employmentType: string | null;
  employmentStatus: string;
  bloodGroup: string | null;
  maritalStatus: string | null;
  spouseName: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactPhone: string | null;
  emergencyContactAltPhone: string | null;
  emergencyContactAddress: string | null;
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500";

function dateForInput(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams<{ employeeId: string }>();

  const employeeId = params.employeeId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    let cancelled = false;

    async function loadEmployee() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/employees/${employeeId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Unable to load employee."
          );
        }

        if (cancelled) return;

        const employee = result.data;

        setForm({
          fullName: employee.fullName ?? "",
          phone: employee.phone ?? "",
          email: employee.email ?? "",
          dateOfBirth: dateForInput(employee.dateOfBirth),
          gender: employee.gender ?? "",
          address: employee.address ?? "",
          designation: employee.designation ?? "",
          department: employee.department ?? "",
          joiningDate: dateForInput(employee.joiningDate),
          employmentType: employee.employmentType ?? "",
          employmentStatus: employee.employmentStatus ?? "ACTIVE",
          bloodGroup: employee.bloodGroup ?? "",
          maritalStatus: employee.maritalStatus ?? "",
          spouseName: employee.spouseName ?? "",
          emergencyContactName:
            employee.emergencyContactName ?? "",
          emergencyContactRelationship:
            employee.emergencyContactRelationship ?? "",
          emergencyContactPhone:
            employee.emergencyContactPhone ?? "",
          emergencyContactAltPhone:
            employee.emergencyContactAltPhone ?? "",
          emergencyContactAddress:
            employee.emergencyContactAddress ?? "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load employee."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEmployee();

    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/employees/${employeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to update employee."
        );
      }

      setSuccess(
        result?.message || "Employee updated successfully."
      );

      setTimeout(() => {
        router.push(`/admin/employees/${employeeId}`);
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update employee."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-400">Loading employee record...</p>
        </div>
      </main>
    );
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
              Edit Employee
            </h1>

            <p className="mt-2 text-slate-400">
              Update the secure employee record for {employeeId}.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/admin/employees/${employeeId}`)
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            Back to Employee
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full Name *
                </label>
                <input
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  className={inputClass}
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
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) =>
                    updateField("dateOfBirth", event.target.value)
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
                  onChange={(event) =>
                    updateField("gender", event.target.value)
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
                  onChange={(event) =>
                    updateField("bloodGroup", event.target.value)
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
                  rows={3}
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Employment Details
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Designation *
                </label>
                <input
                  required
                  value={form.designation}
                  onChange={(event) =>
                    updateField("designation", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Department
                </label>
                <input
                  value={form.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                  className={inputClass}
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
                  onChange={(event) =>
                    updateField("joiningDate", event.target.value)
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
                  onChange={(event) =>
                    updateField(
                      "employmentType",
                      event.target.value
                    )
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
                  onChange={(event) =>
                    updateField(
                      "employmentStatus",
                      event.target.value
                    )
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
            <h2 className="text-xl font-semibold">
              Family Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Marital Status
                </label>
                <select
                  value={form.maritalStatus}
                  onChange={(event) =>
                    updateField(
                      "maritalStatus",
                      event.target.value
                    )
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
                  onChange={(event) =>
                    updateField("spouseName", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Emergency Contact
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Contact Name
                </label>
                <input
                  value={form.emergencyContactName}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactName",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Relationship
                </label>
                <input
                  value={form.emergencyContactRelationship}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactRelationship",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactPhone",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={form.emergencyContactAltPhone}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactAltPhone",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Emergency Contact Address
                </label>
                <textarea
                  rows={3}
                  value={form.emergencyContactAddress}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactAddress",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
            Employee records are confidential. Updates are restricted
            to authorized ETW administrators.
          </div>

          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() =>
                router.push(`/admin/employees/${employeeId}`)
              }
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}