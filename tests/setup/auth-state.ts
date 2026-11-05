/** Where the saved standard_user session lives. Kept apart from auth.setup.ts so that
 * importing the path never re-registers the setup test inside another spec file. */
export const STANDARD_USER_STATE = ".auth/standard_user.json";
