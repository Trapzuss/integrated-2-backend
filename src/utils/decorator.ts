import { SetMetadata } from '@nestjs/common';

// skip auth
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
