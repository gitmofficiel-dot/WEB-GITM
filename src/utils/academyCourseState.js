export function hasCourseModules(course) {
  return Array.isArray(course?.modules) && course.modules.length > 0;
}

export function resolveCourseStartTransition(course) {
  if (!hasCourseModules(course)) {
    return { started: false, showIntro: false, allowed: false };
  }
  return {
    started: true,
    showIntro: Boolean(course.courseIntroVideo || course.courseIntroText),
    allowed: true,
  };
}
