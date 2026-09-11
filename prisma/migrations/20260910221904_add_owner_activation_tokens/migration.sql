-- CreateTable
CREATE TABLE "OwnerActivationToken" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerActivationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnerActivationToken_tokenHash_key" ON "OwnerActivationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "OwnerActivationToken_ownerId_idx" ON "OwnerActivationToken"("ownerId");

-- CreateIndex
CREATE INDEX "OwnerActivationToken_expiresAt_idx" ON "OwnerActivationToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "OwnerActivationToken" ADD CONSTRAINT "OwnerActivationToken_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "VehicleOwner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
