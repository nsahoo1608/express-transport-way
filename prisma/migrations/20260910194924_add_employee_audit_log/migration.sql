-- CreateTable
CREATE TABLE "EmployeeAuditLog" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "previousValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_employeeId_idx" ON "EmployeeAuditLog"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_adminEmail_idx" ON "EmployeeAuditLog"("adminEmail");

-- CreateIndex
CREATE INDEX "EmployeeAuditLog_createdAt_idx" ON "EmployeeAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "EmployeeAuditLog" ADD CONSTRAINT "EmployeeAuditLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
