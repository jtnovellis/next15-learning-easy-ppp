"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { env } from "@/data/env/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CopyCheckIcon, CopyIcon, CopyXIcon } from "lucide-react";
import { useState } from "react";

type CopyState = "ilde" | "copied" | "error";

export function AddToSiteProductModalContent({ id }: { id: string }) {
  const [copyState, setCopyState] = useState<CopyState>("ilde");
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;
  const Icon = getCopyIcon(copyState);

  return (
    <DialogContent className="max-w-max">
      <DialogHeader>
        <DialogTitle>Start earning ppp sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing ppp discounts!
        </DialogDescription>
      </DialogHeader>
      <pre className="mb-4 overflow-x-auto p-4  bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState("copied");
                setTimeout(() => setCopyState("ilde"), 2000);
              })
              .catch(() => {
                setCopyState("error");
                setTimeout(() => setCopyState("ilde"), 2000);
              });
          }}
        >
          {<Icon className="size-4 mr-2" />}
          {getChildren(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "ilde":
      return "Copy code";
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
  }
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "ilde":
      return CopyIcon;
    case "copied":
      return CopyCheckIcon;
    case "error":
      return CopyXIcon;
  }
}
