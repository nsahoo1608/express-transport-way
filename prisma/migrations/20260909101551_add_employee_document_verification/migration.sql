-- AlterTable
ALTER TABLE "EmployeeDocument" ADD COLUMN     "verificationRemarks" TEXT,
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'SUBMITTED',
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;
