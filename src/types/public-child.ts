import type { Prisma } from "../../generated/client";
import {
  PUBLIC_CHILD_CARD_SELECT,
  PUBLIC_CHILD_DETAIL_SELECT,
} from "@/lib/publicChild";

export type PublicChildCard = Prisma.ChildGetPayload<{
  select: typeof PUBLIC_CHILD_CARD_SELECT;
}>;

export type PublicChildDetail = Prisma.ChildGetPayload<{
  select: typeof PUBLIC_CHILD_DETAIL_SELECT;
}>;
