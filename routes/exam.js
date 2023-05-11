const router = require('express').Router();

const {
    createExam,
    getExams,
    deleteExam,
    getSingleExam,
    updateExam,
    getAllExamsDataForStudent,
    registerStudent,
    getExamForStudent,
    getFilteredExam,
    getSingleExamMetaInfo } = require('../controllers/exam');

router.route('/').get(getExams).post(createExam);
router.route('/:id').delete(deleteExam).get(getSingleExam).patch(updateExam);
router.route('/meta-data/:examID').get(getSingleExamMetaInfo);
router.route('/get-exams/student').get(getAllExamsDataForStudent);
router.route('/get-exam-data/:examID').get(getExamForStudent);
router.route('/register-student/:examID').post(registerStudent);
router.route('/filter/get-filtered-exams/:topics').get(getFilteredExam);

module.exports = router;