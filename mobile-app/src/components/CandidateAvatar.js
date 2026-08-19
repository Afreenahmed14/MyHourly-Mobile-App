import SafeAvatar from './SafeAvatar';

/**
 * Drop-in for SafeAvatar, specialized for candidates. A candidate can
 * have two different pictures on file:
 *   - `avatarImage`   — the illustrated Bitmoji-style avatar built in
 *                        AvatarBuilderScreen. Optional, but when set the
 *                        candidate chose it deliberately as their public
 *                        face, so it takes priority.
 *   - `profileImage`  — the real uploaded photo.
 *
 * Every screen that shows a candidate's picture (home page, profile,
 * search cards, candidate details) should render through this component
 * instead of reading `profileImage` directly, so a saved avatar actually
 * shows up everywhere rather than only on the one screen that happens to
 * check `avatarImage` first.
 */
export default function CandidateAvatar({ candidate, size = 44, style, fallbackSource }) {
  const uri = candidate?.avatarImage || candidate?.profileImage || null;
  return (
    <SafeAvatar
      uri={uri}
      size={size}
      label={candidate?.name}
      fallbackSource={fallbackSource}
      style={style}
    />
  );
}
