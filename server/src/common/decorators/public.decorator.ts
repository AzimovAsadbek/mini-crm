import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Global JWT guardni chetlab o'tadi — login/register kabi ochiq endpointlar uchun. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
