-- CreateTable
CREATE TABLE "OwnerDocumentVerification" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "overallStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "verificationSource" TEXT,
    "sourceReference" TEXT,
    "checkedBy" TEXT,
    "checkedAt" TIMESTAMP(3),
    "confidenceScore" DECIMAL(65,30),
    "finalRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerDocumentVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerDocumentVerificationCheck" (
    "id" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT,
    "reference" TEXT,
    "result" TEXT,
    "remarks" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerDocumentVerificationCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerDocumentVerificationAudit" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "verificationId" TEXT,
    "adminEmail" TEXT,
    "action" TEXT NOT NULL,
    "previousStatus" TEXT,
    "newStatus" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerDocumentVerificationAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OwnerDocumentVerification_documentId_idx" ON "OwnerDocumentVerification"("documentId");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerification_overallStatus_idx" ON "OwnerDocumentVerification"("overallStatus");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerification_verificationSource_idx" ON "OwnerDocumentVerification"("verificationSource");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationCheck_verificationId_idx" ON "OwnerDocumentVerificationCheck"("verificationId");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationCheck_checkType_idx" ON "OwnerDocumentVerificationCheck"("checkType");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationCheck_status_idx" ON "OwnerDocumentVerificationCheck"("status");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationAudit_documentId_idx" ON "OwnerDocumentVerificationAudit"("documentId");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationAudit_verificationId_idx" ON "OwnerDocumentVerificationAudit"("verificationId");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationAudit_adminEmail_idx" ON "OwnerDocumentVerificationAudit"("adminEmail");

-- CreateIndex
CREATE INDEX "OwnerDocumentVerificationAudit_createdAt_idx" ON "OwnerDocumentVerificationAudit"("createdAt");

-- AddForeignKey
ALTER TABLE "OwnerDocumentVerification" ADD CONSTRAINT "OwnerDocumentVerification_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "OwnerDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDocumentVerificationCheck" ADD CONSTRAINT "OwnerDocumentVerificationCheck_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "OwnerDocumentVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDocumentVerificationAudit" ADD CONSTRAINT "OwnerDocumentVerificationAudit_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "OwnerDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

