import { NextResponse } from "next/server";

export const apiError = (
  code: string,
  message: string,
  status: number,
  details?: Array<{ field: string; message: string }>
) =>
  NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details?.length ? { details } : {})
      }
    },
    { status }
  );

export const validationError = (
  issues: Array<{ path: PropertyKey[]; message: string }>,
  message = "Certaines informations sont invalides."
) =>
  apiError(
    "validation_error",
    message,
    422,
    issues.map((issue) => ({
      field: issue.path.map(String).join("."),
      message: issue.message
    }))
  );
