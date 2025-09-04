"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { US_STATES } from "@/lib/states";
import { useToast } from "@/components/ui/use-toast";

export default function AddPlateModal({
  open, onOpenChange, onAdded
}:{ open:boolean; onOpenChange:(v:boolean)=>void; onAdded:()=>void }) {
  const [plate, setPlate] = React.useState("");
  const [state, setState] = React.useState("CA");
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  async function handleSave(){
    if (!plate || !state) return;
    setSaving(true);
    const res = await fetch("/api/plates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ license_plate: plate.toUpperCase(), state })
    });
    setSaving(false);
    if (!res.ok) { toast({ variant:"destructive", title:"Couldn’t add plate" }); return; }
    onOpenChange(false);
    onAdded();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add license plate</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input id="plate" placeholder="ABC1234" value={plate} onChange={(e)=>setPlate(e.target.value.toUpperCase())} className="font-mono"/>
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent className="max-h-64">
                {US_STATES.map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700" disabled={saving}>
            {saving ? "Saving..." : "Save plate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
