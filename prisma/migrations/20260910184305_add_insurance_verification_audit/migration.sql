-- AlterTable
ALTER TABLE "EmployeeInsurance" ADD COLUMN     "verificationRemarks" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;
