"use client";

import { useEffect } from "react";
import PreviewBlock from "@/components/PreviewBlock";
import { EVENTS, track } from "@/lib/track";

export default function ConfirmClient(props: { email: string; phone: string; visible: boolean }) {
  useEffect(() => {
    try { track(EVENTS.VIEW_RESULTS); } catch {}
  }, []);
  return (
    <section aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="sr-only">Preview</h2>
      <PreviewBlock email={props.email} phone={props.phone} visible={props.visible} />
    </section>
  );
}