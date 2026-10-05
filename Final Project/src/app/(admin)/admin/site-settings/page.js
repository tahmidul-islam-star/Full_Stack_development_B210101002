"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Settings, Trash2 } from "lucide-react";

const emptyStat = { label: "", value: "0+", icon: "Users", usesMemberCount: false };

const fields = [
  ["clubName", "Club name", "text"],
  ["tagline", "Tagline", "text"],
  ["clubDescription", "Club description", "textarea"],
  ["email", "Official club email", "email"],
  ["facebookUrl", "Official Facebook page", "url"],
  ["universityUrl", "University club page", "url"],
  ["constitutionUrl", "Club constitution URL", "url"],
  ["copyrightText", "Footer copyright text", "text"],
  ["heroTitle", "Homepage hero title", "text"],
  ["heroSubtitle", "Homepage hero description", "textarea"],
  ["membershipCtaText", "Membership button text", "text"],
  ["membershipCtaUrl", "Membership button link", "text"],
  ["constitutionCtaText", "Constitution button text", "text"],
];

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load site settings.");
        }
        if (active) setSettings(result.data);
      })
      .catch((loadError) => {
        console.error("Site settings load error:", loadError);
        if (active) setError(loadError.message || "Unable to load site settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const updateStatistic = (index, field, value) => {
    setSettings((current) => ({
      ...current,
      statistics: current.statistics.map((stat, statIndex) =>
        statIndex === index
          ? {
              ...stat,
              [field]: value,
              ...(field === "usesMemberCount" && value && !stat.value
                ? { value: "0+" }
                : {}),
            }
          : stat
      ),
    }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save site settings.");
      }
      setSettings(result.data);
      setMessage("Site settings saved.");
    } catch (saveError) {
      console.error("Site settings save error:", saveError);
      setError(saveError.message || "Unable to save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-slate-500">Loading site settings…</p>;
  }
  if (!settings) {
    return <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error || "Site settings are unavailable."}</p>;
  }

  return (
    <>
      <header className="border-b border-slate-200 pb-6">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-900">
          <Settings className="h-8 w-8 text-indigo-600" />
          Site Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">Manage official club information, homepage copy, links, and statistics.</p>
      </header>

      <form onSubmit={saveSettings} className="mt-6 max-w-5xl space-y-6">
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Club information & official links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.slice(0, 8).map(([field, label, type]) => (
              <label key={field} className={`block text-xs font-semibold text-slate-600 ${type === "textarea" ? "sm:col-span-2" : ""}`}>
                {label}
                {type === "textarea" ? (
                  <textarea rows={3} value={settings[field] || ""} onChange={(event) => updateField(field, event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                ) : (
                  <input type={type} value={settings[field] || ""} onChange={(event) => updateField(field, event.target.value)} required={field === "clubName" || field === "email"} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Homepage hero</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.slice(8).map(([field, label, type]) => (
              <label key={field} className={`block text-xs font-semibold text-slate-600 ${type === "textarea" ? "sm:col-span-2" : ""}`}>
                {label}
                {type === "textarea" ? (
                  <textarea rows={3} value={settings[field] || ""} onChange={(event) => updateField(field, event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                ) : (
                  <input type={type} value={settings[field] || ""} onChange={(event) => updateField(field, event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-indigo-500" />
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Homepage statistics</h2>
              <p className="mt-1 text-xs text-slate-500">The active-member card can remain linked to the live member count.</p>
            </div>
            <button type="button" onClick={() => updateField("statistics", [...settings.statistics, { ...emptyStat }])} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Plus className="h-4 w-4" />
              Add statistic
            </button>
          </div>
          <div className="space-y-3">
            {settings.statistics.map((stat, index) => (
              <div key={index} className="grid sm:grid-cols-[1fr_1fr_150px_auto] items-end gap-3 rounded-xl bg-slate-50 p-3">
                <label className="block text-xs font-semibold text-slate-600">Label
                  <input required value={stat.label} onChange={(event) => updateStatistic(index, "label", event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900" />
                </label>
                <label className="block text-xs font-semibold text-slate-600">Value
                  <input required={!stat.usesMemberCount} disabled={stat.usesMemberCount} value={stat.value || ""} onChange={(event) => updateStatistic(index, "value", event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 disabled:bg-slate-100" />
                </label>
                <label className="block text-xs font-semibold text-slate-600">Icon
                  <select value={stat.icon || "Users"} onChange={(event) => updateStatistic(index, "icon", event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900">
                    {["Users", "Trophy", "Zap", "Award"].map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </label>
                <button type="button" onClick={() => updateField("statistics", settings.statistics.filter((_, statIndex) => statIndex !== index))} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove statistic ${index + 1}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
                <label className="sm:col-span-4 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <input type="checkbox" checked={Boolean(stat.usesMemberCount)} onChange={(event) => updateStatistic(index, "usesMemberCount", event.target.checked)} />
                  Use live active-member count
                </label>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-60">
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save Site Settings"}
          </button>
        </div>
      </form>
    </>
  );
}
