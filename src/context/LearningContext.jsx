import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export const LearningContext = createContext(null);
const COURSE_STORAGE_KEY = 'elearn_courses';

export const LearningProvider = ({ children }) => {
  // Course master state
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Search and filter states (managed here and exposed or via useCourses)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [difficultyLevel, setDifficultyLevel] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [instructorFilter, setInstructorFilter] = useState('All');
  const [selectedCourseId, setSelectedCourseId] = useState('101');

  // Enrolled courses state (synced with localStorage)
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('elearn_enrolled');
      // Pre-enroll course 101 by default so student has ready data to test immediately!
      return saved ? JSON.parse(saved) : ['101'];
    } catch {
      return ['101'];
    }
  });

  // Course progress tracking: { [courseId]: { completedLessons: ['l1', 'l2'], lastUpdated: timestamp } }
  const [learningProgress, setLearningProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('elearn_progress');
      return saved ? JSON.parse(saved) : {
        '101': { completedLessons: ['l1', 'l2'], lastUpdated: new Date().toISOString() }
      };
    } catch {
      return { '101': { completedLessons: ['l1', 'l2'], lastUpdated: new Date().toISOString() } };
    }
  });

  // Quiz responses: { [courseId]: { answers: { q1: 1, ... }, score: 100, passed: true, timestamp: ... } }
  const [quizResponses, setQuizResponses] = useState(() => {
    try {
      const saved = localStorage.getItem('elearn_quiz');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Assignment submissions: { [courseId]: { [assignmentId]: { repoUrl: string, liveUrl: string, notes: string, status: 'Submitted', grade: 'Pending' } } }
  const [assignmentStatus, setAssignmentStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('elearn_assignments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load course data on application startup using useEffect
  useEffect(() => {
    let isActive = true;
    setIsLoadingCourses(true);
    import('../data/coursesData')
      .then(({ initialCoursesData }) => {
        if (!isActive) return;
        try {
          const savedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
          const parsedCourses = savedCourses ? JSON.parse(savedCourses) : null;
          setCourses(Array.isArray(parsedCourses) ? parsedCourses : initialCoursesData);
        } catch {
          setCourses(initialCoursesData);
        }
        setIsLoadingCourses(false);
      })
      .catch(() => {
        if (!isActive) return;
        setCourses([]);
        setIsLoadingCourses(false);
      });
    return () => { isActive = false; };
  }, []);

  // Persist the full catalog only after the initial data load has completed.
  useEffect(() => {
    if (isLoadingCourses) return;
    try {
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error('Failed to save course catalog to localStorage', error);
    }
  }, [courses, isLoadingCourses]);

  // Synchronize enrolled courses with browser localStorage using useEffect
  useEffect(() => {
    try {
      localStorage.setItem('elearn_enrolled', JSON.stringify(enrolledCourses));
    } catch (e) {
      console.error("Failed to sync enrolled courses to localStorage", e);
    }
  }, [enrolledCourses]);

  // Synchronize learning progress with browser localStorage using useEffect
  useEffect(() => {
    try {
      localStorage.setItem('elearn_progress', JSON.stringify(learningProgress));
    } catch (e) {
      console.error("Failed to sync learning progress to localStorage", e);
    }
  }, [learningProgress]);

  // Synchronize quiz responses with browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elearn_quiz', JSON.stringify(quizResponses));
    } catch (e) {
      console.error("Failed to sync quiz responses", e);
    }
  }, [quizResponses]);

  // Synchronize assignment submissions with browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elearn_assignments', JSON.stringify(assignmentStatus));
    } catch (e) {
      console.error("Failed to sync assignments", e);
    }
  }, [assignmentStatus]);

  // useMemo: Efficiently calculate filtered courses when criteria change
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search criteria
      const matchesSearch = searchTerm.trim() === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      // Category criteria
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;

      // Difficulty criteria
      const matchesDifficulty = difficultyLevel === 'All' || course.difficulty === difficultyLevel;

      // Duration criteria
      let matchesDuration = true;
      if (durationFilter === 'short') matchesDuration = course.durationHours < 30;
      else if (durationFilter === 'medium') matchesDuration = course.durationHours >= 30 && course.durationHours <= 40;
      else if (durationFilter === 'long') matchesDuration = course.durationHours > 40;

      // Instructor criteria
      const matchesInstructor = instructorFilter === 'All' || course.instructor === instructorFilter;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesInstructor;
    });
  }, [courses, searchTerm, selectedCategory, difficultyLevel, durationFilter, instructorFilter]);

  // Helper to check if a specific course is enrolled
  const isEnrolled = useCallback((courseId) => {
    return enrolledCourses.includes(String(courseId));
  }, [enrolledCourses]);

  // useCallback: enrollCourse()
  const enrollCourse = useCallback((courseId, studentInfo = null) => {
    const cid = String(courseId);
    if (!cid) return { success: false, message: "Invalid course ID" };

    if (enrolledCourses.includes(cid)) {
      return { success: false, message: "Course already enrolled" };
    }

    setEnrolledCourses(prev => [...prev, cid]);
    // Initialize progress if not already present
    setLearningProgress(prev => ({
      ...prev,
      [cid]: prev[cid] || { completedLessons: [], lastUpdated: new Date().toISOString() }
    }));

    return { success: true, message: "Successfully enrolled in course!" };
  }, [enrolledCourses]);

  // useCallback: updateProgress()
  const updateProgress = useCallback((courseId, lessonId) => {
    const cid = String(courseId);
    setLearningProgress(prev => {
      const current = prev[cid] || { completedLessons: [] };
      const exists = current.completedLessons.includes(lessonId);
      const updatedLessons = exists
        ? current.completedLessons.filter(id => id !== lessonId)
        : [...current.completedLessons, lessonId];

      return {
        ...prev,
        [cid]: {
          ...current,
          completedLessons: updatedLessons,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  }, []);

  // useCallback: completeLesson()
  const completeLesson = useCallback((courseId, lessonId) => {
    const cid = String(courseId);
    setLearningProgress(prev => {
      const current = prev[cid] || { completedLessons: [] };
      if (current.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        [cid]: {
          ...current,
          completedLessons: [...current.completedLessons, lessonId],
          lastUpdated: new Date().toISOString()
        }
      };
    });
  }, []);

  // useCallback: submitQuiz()
  const submitQuiz = useCallback((courseId, userAnswers, totalQuestions, correctCount) => {
    const cid = String(courseId);
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    const quizRecord = {
      answers: userAnswers,
      score,
      passed,
      totalQuestions,
      correctCount,
      submittedAt: new Date().toISOString()
    };

    setQuizResponses(prev => ({
      ...prev,
      [cid]: quizRecord
    }));

    return { success: true, score, passed };
  }, []);

  // useCallback: submitAssignment()
  const submitAssignment = useCallback((courseId, assignmentId, data) => {
    const cid = String(courseId);
    const aid = String(assignmentId);

    const submissionRecord = {
      ...data,
      id: aid,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      grade: "A (95/100)",
      feedback: "Great job meeting all rubric requirements and documenting component modularity."
    };

    setAssignmentStatus(prev => ({
      ...prev,
      [cid]: {
        ...(prev[cid] || {}),
        [aid]: submissionRecord
      }
    }));

    return { success: true, message: "Assignment submitted successfully!" };
  }, []);

  // useMemo: Calculate Course completion percentage for any given course
  const getCourseCompletionPercentage = useCallback((courseId) => {
    const cid = String(courseId);
    const course = courses.find(c => c.id === cid);
    if (!course) return 0;

    const totalLessons = course.learningMaterials?.length || 1;
    const completedLessons = learningProgress[cid]?.completedLessons?.length || 0;
    const lessonsRatio = Math.min(1, completedLessons / totalLessons);

    const hasCompletedQuiz = quizResponses[cid]?.passed ? 1 : 0;
    const courseAssignments = course.assignments || [];
    const hasSubmittedAssignment = courseAssignments.length === 0 ||
      Boolean(assignmentStatus[cid] && Object.keys(assignmentStatus[cid]).length > 0) ? 1 : 0;

    // Weighting: 60% lessons, 20% quiz, 20% assignment
    const weightedProgress = Math.round(
      (lessonsRatio * 60) + (hasCompletedQuiz * 20) + (hasSubmittedAssignment * 20)
    );

    return Math.min(100, Math.max(0, weightedProgress));
  }, [courses, learningProgress, quizResponses, assignmentStatus]);

  // useMemo: Quiz score getter
  const getQuizScore = useCallback((courseId) => {
    const cid = String(courseId);
    return quizResponses[cid] || null;
  }, [quizResponses]);

  // useMemo: Assignment status getter
  const getAssignmentStatus = useCallback((courseId, assignmentId) => {
    const cid = String(courseId);
    const aid = String(assignmentId);
    return assignmentStatus[cid]?.[aid] || null;
  }, [assignmentStatus]);

  // useMemo: Certificate eligibility calculation
  const isCertificateEligible = useCallback((courseId) => {
    const cid = String(courseId);
    if (!enrolledCourses.includes(cid)) return false;

    const course = courses.find(c => c.id === cid);
    if (!course) return false;

    // Must complete all lessons or >= 80% completion
    const totalLessons = course.learningMaterials?.length || 1;
    const completedCount = learningProgress[cid]?.completedLessons?.length || 0;
    const lessonsCompleted = completedCount >= totalLessons || (completedCount / totalLessons) >= 0.8;

    // Must pass quiz
    const quizPassed = Boolean(quizResponses[cid]?.passed);

    // Must submit assignment (if assignments exist)
    const assignments = course.assignments || [];
    const assignmentsDone = assignments.length === 0 ||
      Boolean(assignmentStatus[cid] && Object.keys(assignmentStatus[cid]).length >= assignments.length);

    return lessonsCompleted && quizPassed && assignmentsDone;
  }, [enrolledCourses, courses, learningProgress, quizResponses, assignmentStatus]);

  // useMemo: Overall learning progress across all enrolled courses
  const overallLearningProgress = useMemo(() => {
    if (enrolledCourses.length === 0) return 0;
    const totalPercentage = enrolledCourses.reduce((sum, cid) => {
      return sum + getCourseCompletionPercentage(cid);
    }, 0);
    return Math.round(totalPercentage / enrolledCourses.length);
  }, [enrolledCourses, getCourseCompletionPercentage]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setDifficultyLevel('All');
    setDurationFilter('All');
    setInstructorFilter('All');
  }, []);

  // Admin course CRUD. This demo persists catalog changes in the current browser.
  const createCourse = useCallback((courseData) => {
    const numericIds = courses.map(course => Number.parseInt(course.id, 10)).filter(Number.isFinite);
    const id = String(Math.max(100, ...numericIds) + 1);
    const hours = Number(courseData.durationHours) || 1;
    const course = {
      ...courseData,
      id,
      durationHours: hours,
      duration: `${hours} hours`,
      rating: 0,
      studentsCount: 0,
      learningMaterials: [{
        id: `l${id}`,
        title: `Welcome to ${courseData.title}`,
        duration: '15 mins',
        type: 'Introduction',
        summary: `Get started with ${courseData.title}.`,
        content: courseData.description,
        resources: []
      }],
      quiz: [],
      assignments: []
    };
    setCourses(previous => [course, ...previous]);
    console.log('[EduVantage CRUD] CREATE course', {
      id: course.id,
      title: course.title,
      category: course.category,
      timestamp: new Date().toISOString()
    });
    return course;
  }, [courses]);

  const updateCourse = useCallback((courseId, courseData) => {
    const id = String(courseId);
    const existingCourse = courses.find(course => course.id === id);
    if (!existingCourse) return false;
    const hours = Number(courseData.durationHours) || 1;
    setCourses(previous => previous.map(course => course.id === id
      ? { ...course, ...courseData, id, durationHours: hours, duration: `${hours} hours` }
      : course));
    console.log('[EduVantage CRUD] UPDATE course', {
      id,
      title: courseData.title || existingCourse.title,
      category: courseData.category || existingCourse.category,
      timestamp: new Date().toISOString()
    });
    return true;
  }, [courses]);

  const deleteCourse = useCallback((courseId) => {
    const id = String(courseId);
    const deletedCourse = courses.find(course => course.id === id);
    if (!deletedCourse) return false;
    setCourses(previous => previous.filter(course => course.id !== id));
    setEnrolledCourses(previous => previous.filter(enrolledId => enrolledId !== id));
    setLearningProgress(previous => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    setQuizResponses(previous => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    setAssignmentStatus(previous => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    console.log('[EduVantage CRUD] DELETE course', {
      id,
      title: deletedCourse.title,
      timestamp: new Date().toISOString()
    });
    return true;
  }, [courses]);

  return (
    <LearningContext.Provider
      value={{
        courses,
        isLoadingCourses,
        createCourse,
        updateCourse,
        deleteCourse,
        filteredCourses,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        difficultyLevel,
        setDifficultyLevel,
        durationFilter,
        setDurationFilter,
        instructorFilter,
        setInstructorFilter,
        selectedCourseId,
        setSelectedCourseId,
        enrolledCourses,
        learningProgress,
        quizResponses,
        assignmentStatus,
        isEnrolled,
        enrollCourse,
        updateProgress,
        completeLesson,
        submitQuiz,
        submitAssignment,
        getCourseCompletionPercentage,
        getQuizScore,
        getAssignmentStatus,
        isCertificateEligible,
        overallLearningProgress,
        resetFilters
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
