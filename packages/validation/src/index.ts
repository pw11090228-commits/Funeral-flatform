import { z } from "zod";

export const moneySchema = z.number().int().nonnegative().safe();

export const consultationRequestSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(50),
  phone: z.string().trim().min(8).max(20),
  consentToContact: z.literal(true),
  productId: z.string().uuid().optional(),
  funeralHallId: z.string().uuid().optional(),
});

export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;

/** 실제 접수용 입력. 기존 데모 입력 규격과 별도로 유지한다. */
export const consultationSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(50),
  phone: z.string().trim().min(8).max(20).regex(/^[0-9+()\- ]+$/),
  message: z.string().trim().min(1).max(2000),
  consent: z.literal(true),
  consentVersion: z.string().min(1).max(40),
  requestId: z.string().uuid(),
  productId: z.string().uuid().optional(),
  funeralHallId: z.string().uuid().optional(),
}).strict();

export type ConsultationSubmission = z.infer<typeof consultationSubmissionSchema>;
