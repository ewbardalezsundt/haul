"use client";

import { useState } from "react";
import { S } from "@/lib/theme";
import { certColors } from "@/lib/theme";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { JOB_SITES, ATTACHMENTS, OPERATORS, type Asset, type EquipmentRequest } from "@/lib/data";
import { getCompatibleAttachments, getOperatorCertStatus } from "@/lib/helpers";
import { Btn, BackBtn, InfoRow, cardStyle, inputStyle, labelStyle } from "@/components/ui";

interface OrderWizardProps {
  asset: Asset;
  onCancel: () => void;
  onSubmit: (req: Omit<EquipmentRequest, "id" | "status" | "submittedAt">) => void;
}

export default function OrderWizard({ asset, onCancel, onSubmit }: OrderWizardProps) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    jobSiteId: "",
    startDate: "",
    endDate: "",
    attachments: [] as string[],
    fueling: false,
    fuelFreq: "Weekly",
    operatorId: "",
    operatorRequested: false,
  });

  const compatible = getCompatibleAttachments(asset.type);
  const totalSteps = 4;
  const canNext = step === 1 ? form.jobSiteId && form.startDate && form.endDate : true;
  const steps = ["Job & Dates", "Attachments", "Services", "Review"];
  const mobileSteps = ["Job", "Attach", "Service", "Review"];

  const handleSubmit = () => {
    onSubmit({
      assetId: asset.id,
      jobSiteId: form.jobSiteId,
      requestedBy: "Tom Bradley",
      startDate: form.startDate,
      endDate: form.endDate,
      attachments: form.attachments,
      fueling: form.fueling,
      fuelFreq: form.fueling ? form.fuelFreq : null,
      operatorId: form.operatorId || null,
      operatorRequested: form.operatorRequested,
    });
  };

  return (
    <div>
      <BackBtn onClick={onCancel} label="Cancel order" />
      <div style={cardStyle}>
        {/* Wizard header */}
        <div
          style={{
            backgroundColor: S.black90,
            padding: isMobile ? "16px 20px" : "20px 24px",
            borderRadius: "10px 10px 0 0",
            borderTop: `4px solid ${S.red}`,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? 12 : 16,
          }}
        >
          {isMobile ? (
            <img src={asset.photo} alt={asset.name} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6 }} />
          ) : (
            <img src={asset.photo} alt={asset.name} style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
          )}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: S.white, margin: 0 }}>
              Request: {asset.name}
            </h2>
            <p style={{ fontSize: 12, color: S.lightGray, marginTop: 2 }}>
              {asset.make} · {asset.model} · ${asset.rate.toLocaleString()}/wk
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8 }}>
            {steps.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8, flex: 1 }}>
                <div
                  style={{
                    width: isMobile ? 24 : 30,
                    height: isMobile ? 24 : 30,
                    borderRadius: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    backgroundColor:
                      i + 1 < step ? S.green : i + 1 === step ? S.navy : S.qdrGray,
                    color: i + 1 <= step ? S.white : S.darkGray,
                  }}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontSize: isMobile ? 10 : 11,
                    fontWeight: 500,
                    color: i + 1 === step ? S.black90 : S.darkGray,
                  }}
                >
                  {isMobile ? mobileSteps[i] : label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      height: 2,
                      flex: 1,
                      backgroundColor: i + 1 < step ? S.lightGreen : S.qdrGray,
                      borderRadius: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div style={{ padding: 24 }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Job Site *</label>
                <select
                  value={form.jobSiteId}
                  onChange={(e) => setForm({ ...form, jobSiteId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Select a job site...</option>
                  {JOB_SITES.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.code})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>End Date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Operator (optional)</label>
                <select
                  value={form.operatorId}
                  onChange={(e) => setForm({ ...form, operatorId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">No operator selected</option>
                  {OPERATORS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} — {o.certifications.join(", ")} ({o.status})
                    </option>
                  ))}
                </select>
                {form.operatorId && (() => {
                  const cert = getOperatorCertStatus(form.operatorId, asset.certRequired);
                  if (cert.status === "valid")
                    return <p style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: S.darkGreen }}>✓ {cert.label}</p>;
                  if (cert.status !== "none")
                    return <p style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: S.black70 }}>⚠ {cert.label}</p>;
                  return null;
                })()}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {compatible.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontSize: 13, color: S.black70 }}>
                    Select attachments compatible with {asset.type}:
                  </p>
                  {compatible.map((att) => (
                    <label
                      key={att.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: 12,
                        border: `1px solid ${S.qdrGray}`,
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.attachments.includes(att.id)}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            attachments: e.target.checked
                              ? [...form.attachments, att.id]
                              : form.attachments.filter((a) => a !== att.id),
                          })
                        }
                        style={{ accentColor: S.navy }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500, color: S.black80 }}>
                        {att.name}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 40, color: S.darkGray, fontSize: 13 }}>
                  No attachments available for {asset.type}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 16,
                  border: `1px solid ${S.qdrGray}`,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.fueling}
                  onChange={(e) => setForm({ ...form, fueling: e.target.checked })}
                  style={{ accentColor: S.navy }}
                />
                <span style={{ fontSize: 15 }}>⛽</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: S.black80 }}>
                  Request fueling service
                </span>
              </label>
              {form.fueling && (

                <div style={{ marginLeft: 28 }}>
                  <label style={labelStyle}>Fueling Frequency</label>
                  <select
                    value={form.fuelFreq}
                    onChange={(e) => setForm({ ...form, fuelFreq: e.target.value })}
                    style={inputStyle}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>As Needed</option>
                  </select>
                </div>
              )}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 16,
                  border: `1px solid ${S.qdrGray}`,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.operatorRequested}
                  onChange={(e) => setForm({ ...form, operatorRequested: e.target.checked })}
                  style={{ accentColor: S.navy }}
                />
                <span style={{ fontSize: 15 }}>👷</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: S.black80 }}>
                    Request Sundt-provided operator
                  </span>
                  <p style={{ fontSize: 11, color: S.black70, margin: "2px 0 0" }}>
                    Equipment Services will assign a certified operator
                  </p>
                </div>
              </label>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.black90, marginBottom: 12 }}>
                Order Summary
              </div>
              <div style={{ backgroundColor: S.almostWhite, borderRadius: 8, padding: 20 }}>
                <InfoRow label="Equipment" value={asset.name} />
                <InfoRow
                  label="Job Site"
                  value={JOB_SITES.find((j) => j.id === form.jobSiteId)?.name || "—"}
                />
                <InfoRow label="Dates" value={`${form.startDate} → ${form.endDate}`} />
                <InfoRow label="Rate" value={`$${asset.rate.toLocaleString()}/wk`} />
                {form.attachments.length > 0 && (
                  <InfoRow
                    label="Attachments"
                    value={form.attachments
                      .map((aId) => ATTACHMENTS.find((a) => a.id === aId)?.name)
                      .join(", ")}
                  />
                )}
                <InfoRow label="Fueling" value={form.fueling ? `Yes — ${form.fuelFreq}` : "No"} />
                <InfoRow label="Operator Service" value={form.operatorRequested ? "Yes — Sundt-provided" : "Self-operated"} />
                {form.operatorId && (
                  <InfoRow
                    label="Operator"
                    value={OPERATORS.find((o) => o.id === form.operatorId)?.name || "—"}
                  />
                )}
                {form.operatorId && (() => {
                  const cert = getOperatorCertStatus(form.operatorId, asset.certRequired);
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderTop: `1px solid ${S.qdrGray}`,
                        marginTop: 4,
                      }}
                    >
                      <span style={{ fontSize: 13, color: S.black70 }}>Certification</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: certColors[cert.status] || S.darkGray,
                        }}
                      >
                        {cert.status === "valid" ? "✅ " : cert.status !== "none" ? "⚠ " : ""}
                        {cert.label}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column-reverse" : "row",
              justifyContent: "space-between",
              gap: isMobile ? 8 : 0,
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${S.qdrGray}`,
            }}
          >
            <Btn variant="secondary" onClick={() => (step === 1 ? onCancel() : setStep(step - 1))} style={isMobile ? { width: "100%" } : undefined}>
              {step === 1 ? "Cancel" : "← Back"}
            </Btn>
            {step < totalSteps ? (
              <Btn variant="primary" disabled={!canNext} onClick={() => setStep(step + 1)} style={isMobile ? { width: "100%" } : undefined}>
                Next →
              </Btn>
            ) : (
              <Btn variant="submit" onClick={handleSubmit} style={isMobile ? { width: "100%" } : undefined}>
                Submit Request
              </Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
