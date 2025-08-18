"use client";

import { useEffect } from "react";
import PreviewBlock from "@/components/PreviewBlock";
import { track } from "@/lib/track";

export default function ConfirmClient(props: { email: string; phone: string; visible: boolean }) {
  useEffect(() => {
    try { track("subscription_confirm_view"); } catch {}
  }, []);
  return (
    <section aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="sr-only">Preview</h2>
      <PreviewBlock email={props.email} phone={props.phone} visible={props.visible} />
    </section>
  );
}