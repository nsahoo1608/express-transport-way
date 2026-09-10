import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth/session";

type EmployeeProfilePageProps = {
  params: Promise<{ employeeId: string }>;
};

function formatDate(value: Date | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function display(value: string | null | undefined) {
  return value?.trim() || "—";
}

export default async function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  const { employeeId } = await params;

  const employee = await prisma.employee.findUnique({
    where: {
      employeeId,
    },
    include: {
      careerHistory: {
        orderBy: {
          effectiveDate: "desc",
        },
      },
      documents: {
        orderBy: {
          uploadedAt: "desc",
        },
      },
      salaryHistory: {
        orderBy: {
          effectiveFrom: "desc",
        },
      },
      advanceHistory: {
        orderBy: {
          advanceDate: "desc",
        },
      },
      insuranceHistory: {
        orderBy: {
          startDate: "desc",
        },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const verifiedDocuments = employee.documents.filter(
    (document) => document.verificationStatus === "VERIFIED"
  ).length;

  const activeInsurance = employee.insuranceHistory.filter(
    (insurance) => insurance.status === "ACTIVE"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Express Transport Way
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Employee Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Internal employee workspace and workforce record.
            </p>
          </div>

          <Link
            href="/admin/employees"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            ← Employee Management
          </Link>
        </div>

        <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                ETW Employee Code
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {employee.employeeId}
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {employee.fullName}
              </h2>

              <p className="mt-2 text-slate-400">
                {employee.designation}
                {employee.department
                  ? ` • ${employee.department}`
                  : ""}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Employment Status
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-400">
                {employee.employmentStatus}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              href={`/admin/employees/${employee.employeeId}/edit`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Edit Employee
            </Link>

            <Link
              href={`/admin/employees/${employee.employeeId}/id-card`}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
            >
              View ID Card
            </Link>
          </div>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Documents</p>
            <p className="mt-2 text-3xl font-bold">
              {employee.documents.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {verifiedDocuments} verified
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Career Records</p>
            <p className="mt-2 text-3xl font-bold">
              {employee.careerHistory.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Promotions and role history
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Insurance</p>
            <p className="mt-2 text-3xl font-bold">
              {employee.insuranceHistory.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {activeInsurance} active
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/admin/employees/${employee.employeeId}/id-card`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            View Employee ID Card
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Personal Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Full Name
              </p>
              <p className="mt-1">{employee.fullName}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Phone
              </p>
              <p className="mt-1">{employee.phone}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </p>
              <p className="mt-1">{display(employee.email)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Date of Birth
              </p>
              <p className="mt-1">{formatDate(employee.dateOfBirth)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Gender
              </p>
              <p className="mt-1">{display(employee.gender)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Blood Group
              </p>
              <p className="mt-1">{display(employee.bloodGroup)}</p>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Address
              </p>
              <p className="mt-1">{display(employee.address)}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Employment Details
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Employee ID
              </p>
              <p className="mt-1 font-semibold text-emerald-400">
                {employee.employeeId}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Designation
              </p>
              <p className="mt-1">{employee.designation}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Department
              </p>
              <p className="mt-1">{display(employee.department)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Joining Date
              </p>
              <p className="mt-1">{formatDate(employee.joiningDate)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Employment Type
              </p>
              <p className="mt-1">
                {display(employee.employmentType)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Status
              </p>
              <p className="mt-1">{employee.employmentStatus}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Family & Emergency Contact
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Marital Status
              </p>
              <p className="mt-1">
                {display(employee.maritalStatus)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Spouse Name
              </p>
              <p className="mt-1">{display(employee.spouseName)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Emergency Contact
              </p>
              <p className="mt-1">
                {display(employee.emergencyContactName)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Relationship
              </p>
              <p className="mt-1">
                {display(employee.emergencyContactRelationship)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Primary Phone
              </p>
              <p className="mt-1">
                {display(employee.emergencyContactPhone)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Alternate Phone
              </p>
              <p className="mt-1">
                {display(employee.emergencyContactAltPhone)}
              </p>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Emergency Contact Address
              </p>
              <p className="mt-1">
                {display(employee.emergencyContactAddress)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Career & Promotion History
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {employee.careerHistory.length} career record(s)
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/employees/${employee.employeeId}/career/new`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                + Add Career Record
              </Link>

              <Link
                href={`/admin/employees/${employee.employeeId}?section=career`}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
              >
                Career Management →
              </Link>
            </div>
          </div>

          {employee.careerHistory.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No career history recorded.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {employee.careerHistory.slice(0, 5).map((career) => (
                <div
                  key={career.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-col justify-between gap-2 md:flex-row">
                    <div>
                      <p className="font-semibold">
                        {career.designation}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {display(career.department)}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      Effective {formatDate(career.effectiveDate)}
                    </p>
                  </div>

                  {career.previousDesignation && (
                    <p className="mt-3 text-sm text-slate-400">
                      Previous designation:{" "}
                      <span className="text-slate-200">
                        {career.previousDesignation}
                      </span>
                    </p>
                  )}

                  {career.remarks && (
                    <p className="mt-2 text-sm text-slate-400">
                      {career.remarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Verification-controlled employee documents.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/employees/${employee.employeeId}/documents/new`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                + Add Document
              </Link>

              <Link
                href="/admin/documents"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
              >
                Document Management →
              </Link>
            </div>
          </div>

          {employee.documents.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No documents recorded.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Document</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Uploaded</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {employee.documents.map((document) => (
                    <tr
                      key={document.id}
                      className="border-b border-slate-900"
                    >
                      <td className="px-3 py-4 font-medium">
                        {document.documentName}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {document.documentType}
                      </td>

                      <td className="px-3 py-4">
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold">
                          {document.verificationStatus}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDate(document.uploadedAt)}
                      </td>

                      <td className="px-3 py-4">
                        <Link
                          href={`/admin/documents/${document.id}`}
                          className="font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Insurance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee insurance and policy records.
              </p>
            </div>

            <Link
              href={`/admin/employees/${employee.employeeId}/insurance/new`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              + Add Insurance
            </Link>
          </div>

          {employee.insuranceHistory.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No insurance records recorded.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Provider</th>
                    <th className="px-3 py-3">Policy Number</th>
                    <th className="px-3 py-3">Start</th>
                    <th className="px-3 py-3">Expiry</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {employee.insuranceHistory.map((insurance) => (
                    <tr
                      key={insurance.id}
                      className="border-b border-slate-900"
                    >
                      <td className="px-3 py-4">
                        {insurance.insuranceType}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {insurance.provider}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {insurance.policyNumber}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDate(insurance.startDate)}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDate(insurance.expiryDate)}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-2">
                          <span>{insurance.verificationStatus}</span>

                          <Link
                            href={`/admin/insurance/${insurance.id}`}
                            className="font-semibold text-emerald-400 hover:text-emerald-300"
                          >
                            Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Salary History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee salary records and effective periods.
              </p>
            </div>

            <Link
              href={`/admin/employees/${employee.employeeId}/salary/new`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              + Add Salary Record
            </Link>
          </div>

          {employee.salaryHistory.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No salary records recorded.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Basic Salary</th>
                    <th className="px-3 py-3">Allowances</th>
                    <th className="px-3 py-3">Deductions</th>
                    <th className="px-3 py-3">Effective From</th>
                    <th className="px-3 py-3">Effective To</th>
                  </tr>
                </thead>

                <tbody>
                  {employee.salaryHistory.map((salary) => (
                    <tr
                      key={salary.id}
                      className="border-b border-slate-900"
                    >
                      <td className="px-3 py-4">
                        {salary.basicSalary.toString()}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {salary.allowances.toString()}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {salary.deductions.toString()}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDate(salary.effectiveFrom)}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDate(salary.effectiveTo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Advance History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee advance records and recovery history.
              </p>
            </div>

            <Link
              href={`/admin/employees/${employee.employeeId}/advance/new`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              + Add Advance Record
            </Link>
          </div>

          {employee.advanceHistory.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No advance records recorded.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Reason</th>
                    <th className="px-3 py-3">Recovered</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {employee.advanceHistory.map((advance) => (
                    <tr
                      key={advance.id}
                      className="border-b border-slate-900"
                    >
                      <td className="px-3 py-4">
                        {advance.amount.toString()}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDate(advance.advanceDate)}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {advance.reason}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {advance.recoveredAmount.toString()}
                      </td>

                      <td className="px-3 py-4">
                        {advance.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/admin/employees/${employee.employeeId}/audit`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-600 hover:text-emerald-400"
          >
            View Audit History
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
          This employee profile contains confidential personnel
          information. Access is restricted to authorized ETW
          administrators.
        </div>
      </div>
    </main>
  );
}
