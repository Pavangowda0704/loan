// ============================================================
//  vehicleLoan.controller.js
// ============================================================
import * as VehicleLoan from './vehicleLoan.model.js'

// POST /api/vehicle-loans
export const createVehicleLoan = async (req, res) => {
  try {
    const { full_name, phone, vehicle_type, loan_amount, monthly_income } = req.body;

    if (!full_name)      return res.status(400).json({ message: 'full_name is required' });
    if (!phone)          return res.status(400).json({ message: 'phone is required' });
    if (!/^[0-9]{10}$/.test(phone))
                         return res.status(400).json({ message: 'phone must be exactly 10 digits' });
    if (!vehicle_type)   return res.status(400).json({ message: 'vehicle_type is required' });
    if (!loan_amount)    return res.status(400).json({ message: 'loan_amount is required' });
    if (!monthly_income) return res.status(400).json({ message: 'monthly_income is required' });

    const applicationId = await VehicleLoan.createApplication(req.body);
    res.status(201).json({
      message: 'Vehicle loan application submitted successfully',
      application_id: applicationId,
    });
  } catch (error) {
    console.error('createVehicleLoan error:', error);
    res.status(500).json({ message: 'Server error while submitting application' });
  }
};

// GET /api/vehicle-loans
export const getVehicleLoans = async (req, res) => {
  try {
    const { status, vehicle_type, city } = req.query;
    const apps = await VehicleLoan.getAllApplications({ status, vehicle_type, city });
    res.json(apps);
  } catch (error) {
    console.error('getVehicleLoans error:', error);
    res.status(500).json({ message: 'Failed to fetch vehicle loan applications' });
  }
};

// GET /api/vehicle-loans/stats
export const getVehicleLoanStats = async (req, res) => {
  try {
    const stats = await VehicleLoan.getStats();
    res.json(stats);
  } catch (error) {
    console.error('getVehicleLoanStats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// GET /api/vehicle-loans/:applicationId
export const getVehicleLoanById = async (req, res) => {
  try {
    const application = await VehicleLoan.getApplicationById(req.params.applicationId);
    if (!application)
      return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    console.error('getVehicleLoanById error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

// PUT /api/vehicle-loans/:applicationId/status
export const updateVehicleLoanStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const valid = ['Pending','Under Review','Document Verification','Approved','Rejected','Disbursed'];
    if (!valid.includes(status))
      return res.status(400).json({ message: `status must be one of: ${valid.join(', ')}` });

    await VehicleLoan.updateStatus(req.params.applicationId, status, remarks || '');
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('updateVehicleLoanStatus error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};