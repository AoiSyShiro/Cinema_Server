const Report = require('../models/Report');

// Lấy tất cả báo cáo
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo báo cáo mới
const createReport = async (req, res) => {
    const report = new Report({
        title: req.body.title,
        content: req.body.content,
    });

    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật báo cáo
const updateReport = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedReport = await Report.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Báo cáo không tồn tại' });
        }
        res.json(updatedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa báo cáo
const deleteReport = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Báo cáo không tồn tại' });
        }
        res.status(204).json(); // Không trả về dữ liệu
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy báo cáo theo ID
const getReportById = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Báo cáo không tồn tại' });
        }
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllReports,
    createReport,
    updateReport,
    deleteReport,
    getReportById,
};
