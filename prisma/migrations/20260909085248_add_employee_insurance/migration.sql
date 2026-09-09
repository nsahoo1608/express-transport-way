-- CreateTable
CREATE TABLE "EmployeeInsurance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "coverageAmount" DECIMAL(65,30),
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "verificationStatus" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "policyDocumentUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeInsurance_employeeId_idx" ON "EmployeeInsurance"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeInsurance_policyNumber_idx" ON "EmployeeInsurance"("policyNumber");

-- CreateIndex
CREATE INDEX "EmployeeInsurance_verificationStatus_idx" ON "EmployeeInsurance"("verificationStatus");

-- AddForeignKey
ALTER TABLE "EmployeeInsurance" ADD CONSTRAINT "EmployeeInsurance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
