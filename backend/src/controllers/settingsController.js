// controllers/settingsController.js
import Settings from "../models/Settings.js";

// Get settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        res.status(200).json({
            success: true,
            settings: {
                companyName: settings.companyName,
                companyEmail: settings.companyEmail,
                companyPhone: settings.companyPhone,
                companyAddress: settings.companyAddress,
                currency: settings.currency,
                currencySymbol: settings.currencySymbol,
                quotationPrefix: settings.quotationPrefix,
                lowComplexityLimit: settings.lowComplexityLimit,
                mediumComplexityLimit: settings.mediumComplexityLimit,
                highComplexityLimit: settings.highComplexityLimit,
                taxRate: settings.taxRate,
                enableTax: settings.enableTax,
                enableNotifications: settings.enableNotifications
            }
        });
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update settings
export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        const updates = req.body;
        
        // Update only allowed fields
        const allowedUpdates = [
            'companyName', 'companyEmail', 'companyPhone', 'companyAddress',
            'currency', 'currencySymbol', 'quotationPrefix',
            'lowComplexityLimit', 'mediumComplexityLimit', 'highComplexityLimit',
            'taxRate', 'enableTax', 'enableNotifications',
            'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass'
        ];
        
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                settings[key] = updates[key];
            }
        });
        
        // Update currency symbol based on currency
        if (updates.currency) {
            const currencySymbols = {
                INR: "₹",
                USD: "$",
                EUR: "€",
                GBP: "£"
            };
            settings.currencySymbol = currencySymbols[updates.currency] || "₹";
        }
        
        await settings.save();
        
        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: {
                companyName: settings.companyName,
                companyEmail: settings.companyEmail,
                companyPhone: settings.companyPhone,
                companyAddress: settings.companyAddress,
                currency: settings.currency,
                currencySymbol: settings.currencySymbol,
                quotationPrefix: settings.quotationPrefix,
                lowComplexityLimit: settings.lowComplexityLimit,
                mediumComplexityLimit: settings.mediumComplexityLimit,
                highComplexityLimit: settings.highComplexityLimit,
                taxRate: settings.taxRate,
                enableTax: settings.enableTax,
                enableNotifications: settings.enableNotifications
            }
        });
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update company info only
export const updateCompanyInfo = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        const { companyName, companyEmail, companyPhone, companyAddress } = req.body;
        
        if (companyName !== undefined) settings.companyName = companyName;
        if (companyEmail !== undefined) settings.companyEmail = companyEmail;
        if (companyPhone !== undefined) settings.companyPhone = companyPhone;
        if (companyAddress !== undefined) settings.companyAddress = companyAddress;
        
        await settings.save();
        
        res.status(200).json({
            success: true,
            message: "Company info updated successfully",
            settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update estimation rules only
export const updateEstimationRules = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        const { lowComplexityLimit, mediumComplexityLimit, highComplexityLimit, taxRate, enableTax } = req.body;
        
        if (lowComplexityLimit !== undefined) settings.lowComplexityLimit = lowComplexityLimit;
        if (mediumComplexityLimit !== undefined) settings.mediumComplexityLimit = mediumComplexityLimit;
        if (highComplexityLimit !== undefined) settings.highComplexityLimit = highComplexityLimit;
        if (taxRate !== undefined) settings.taxRate = taxRate;
        if (enableTax !== undefined) settings.enableTax = enableTax;
        
        await settings.save();
        
        res.status(200).json({
            success: true,
            message: "Estimation rules updated successfully",
            settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};