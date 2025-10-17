import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

function Pricing() {
  const [selectedModel, setSelectedModel] = useState('PAYT');
  const [pricingModel, setPricingModel] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pricingModels = [
    { value: 'PAYT', label: 'PAYT (Pay-As-You-Throw)', description: 'Residents pay per kilogram of waste collected' },
    { value: 'FLAT', label: 'Flat Rate', description: 'Fixed monthly fee regardless of waste quantity' },
    { value: 'HYBRID', label: 'Hybrid', description: 'Base fee + additional charges after weight threshold' }
  ];

  const wasteTypes = [
    { id: 'general', name: 'General Waste', color: 'bg-gray-100' },
    { id: 'organic', name: 'Organic Waste', color: 'bg-green-100' },
    { id: 'recycling', name: 'Recycling', color: 'bg-blue-100' },
    { id: 'e_waste', name: 'E-Waste', color: 'bg-purple-100' }
  ];

  useEffect(() => {
    loadActivePricingModel();
  }, []);

  useEffect(() => {
    initializeRates();
  }, [selectedModel]);

  const loadActivePricingModel = async () => {
    try {
      setLoading(true);
      const model = await adminService.getActivePricingModel();
      if (model) {
        setPricingModel(model);
        setSelectedModel(model.name);
        setRates(model.configuration || {});
      }
    } catch (error) {
      console.log('No active pricing model found');
    } finally {
      setLoading(false);
    }
  };

  const initializeRates = () => {
    const baseRates = {
      PAYT: {
        general: 0.15,
        organic: 0.10,
        recycling: 0.00,
        e_waste: 0.25
      },
      FLAT: {
        monthly_fee: 30.00
      },
      HYBRID: {
        base_fee: 20.00,
        threshold: 50,
        excess_rate: 0.12
      }
    };
    setRates(baseRates[selectedModel] || {});
  };

  const handleRateChange = (field, value) => {
    setRates(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSavePricing = async () => {
    try {
      setSaving(true);
      await adminService.createPricingModel({
        name: selectedModel,
        description: pricingModels.find(m => m.value === selectedModel)?.description,
        configuration: rates,
        is_active: true
      });
      await loadActivePricingModel();
      alert('Pricing model saved successfully!');
    } catch (error) {
      alert('Error saving pricing model: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderPAYTRates = () => (
    <div className="grid gap-6">
      {wasteTypes.map(wasteType => (
        <div key={wasteType.id} className={`p-4 rounded-lg border ${wasteType.color}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {wasteType.name} Rate
          </label>
          <div className="flex items-center gap-3">
            <span className="text-gray-600">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={rates[wasteType.id] || 0}
              onChange={(e) => handleRateChange(wasteType.id, e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600">per kg</span>
          </div>
          {wasteType.id === 'recycling' && rates.recycling === 0 && (
            <p className="text-sm text-green-600 mt-2">✓ Recycling is free to encourage participation</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderFlatRates = () => (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Monthly Flat Fee
      </label>
      <div className="flex items-center gap-3">
        <span className="text-gray-600">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={rates.monthly_fee || 0}
          onChange={(e) => handleRateChange('monthly_fee', e.target.value)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-600">per month</span>
      </div>
      <p className="text-sm text-gray-600 mt-2">All residents pay this fixed amount regardless of waste quantity</p>
    </div>
  );

  const renderHybridRates = () => (
    <div className="grid gap-4">
      <div className="p-4 bg-blue-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base Monthly Fee
        </label>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={rates.base_fee || 0}
            onChange={(e) => handleRateChange('base_fee', e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-600">per month</span>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Included Weight Threshold
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="1"
            min="0"
            value={rates.threshold || 0}
            onChange={(e) => handleRateChange('threshold', e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-600">kg included in base fee</span>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excess Rate (after threshold)
        </label>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={rates.excess_rate || 0}
            onChange={(e) => handleRateChange('excess_rate', e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-600">per kg over threshold</span>
        </div>
      </div>
    </div>
  );

  const renderRates = () => {
    switch (selectedModel) {
      case 'PAYT':
        return renderPAYTRates();
      case 'FLAT':
        return renderFlatRates();
      case 'HYBRID':
        return renderHybridRates();
      default:
        return null;
    }
  };

  const getCalculationExample = () => {
    switch (selectedModel) {
      case 'PAYT':
        return "Example: 15kg general waste × $0.15/kg = $2.25";
      case 'FLAT':
        return "Example: Fixed monthly fee = $30.00";
      case 'HYBRID':
        return "Example: Base $20 + (10kg excess × $0.12/kg) = $21.20";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💰 Pricing Configuration</h1>
          <p className="text-gray-600 mt-2">Set how much residents pay for waste collection services</p>
        </div>

        {/* Active Model Banner */}
        {pricingModel && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Active Pricing Model: {pricingModel.name}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Last updated: {new Date(pricingModel.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Select Pricing Model</h2>
            <div className="grid gap-4">
              {pricingModels.map(model => (
                <div
                  key={model.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModel === model.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModel(model.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{model.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedModel === model.value ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Configure Rates</h2>
            {renderRates()}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>How it works:</strong> {getCalculationExample()}
              </p>
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handleSavePricing}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? 'Saving Pricing Model...' : `Save ${selectedModel} as Active Pricing Model`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;