import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateTenderImproved() {
  const [step, setStep] = useState(1);
  const [tenderData, setTenderData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    opening_date: '',
    closing_date: '',
    budget_max: 0,
    currency: 'TND',
    items: []
  });
  const [holidays, setHolidays] = useState([]);
  const [dateConflict, setDateConflict] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Auto-Save كل 30 ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      if (tenderData.title || tenderData.description) {
        saveDraft();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [tenderData]);

  // التحقق من تضارب التواريخ
  useEffect(() => {
    if (tenderData.opening_date && tenderData.closing_date) {
      checkDateConflict();
    }
  }, [tenderData.opening_date, tenderData.closing_date]);

  const saveDraft = async () => {
    try {
      setAutoSaveStatus('جاري الحفظ...');
      await axios.post('http://localhost:5000/api/procurement/tender-draft', tenderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setAutoSaveStatus('✓ تم الحفظ تلقائياً');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    } catch (error) {
      setAutoSaveStatus('✗ خطأ في الحفظ');
    }
  };

  const checkDateConflict = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/procurement/check-date-conflict',
        {
          start_date: tenderData.opening_date,
          end_date: tenderData.closing_date
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      
      if (response.data.conflict) {
        setDateConflict(`⚠️ تحذير: ${response.data.message}`);
      } else {
        setDateConflict('');
      }
    } catch (error) {
      console.error('خطأ:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    setTenderData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 0, specifications: '' }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...tenderData.items];
    newItems[index][field] = value;
    setTenderData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/procurement/tenders', tenderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('تم إنشاء المناقصة بنجاح');
    } catch (error) {
      alert('خطأ: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="create-tender-improved">
      <h1>إنشاء مناقصة جديدة</h1>

      {/* شريط التقدم */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. المعلومات الأساسية</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. التفاصيل والتواريخ</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. البنود والمواصفات</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>4. المراجعة</div>
      </div>

      {/* حالة الحفظ التلقائي */}
      {autoSaveStatus && (
        <div className={`auto-save-status ${autoSaveStatus.includes('✓') ? 'success' : 'error'}`}>
          {autoSaveStatus}
        </div>
      )}

      {/* الخطوة 1 */}
      {step === 1 && (
        <div className="step-content">
          <h2>المعلومات الأساسية</h2>
          <div className="form-group">
            <label>عنوان المناقصة:</label>
            <input 
              type="text"
              name="title"
              value={tenderData.title}
              onChange={handleInputChange}
              placeholder="مثال: توريد أجهزة كمبيوتر"
            />
          </div>

          <div className="form-group">
            <label>الوصف:</label>
            <textarea 
              name="description"
              value={tenderData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="وصف تفصيلي للمناقصة"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>الفئة:</label>
              <select name="category" value={tenderData.category} onChange={handleInputChange}>
                <option value="">اختر الفئة</option>
                <option value="supplies">إمدادات</option>
                <option value="services">خدمات</option>
                <option value="construction">بناء</option>
              </select>
            </div>

            <div className="form-group">
              <label>الموقع:</label>
              <select name="location" value={tenderData.location} onChange={handleInputChange}>
                <option value="">اختر الموقع</option>
                <option value="tunis">تونس</option>
                <option value="sfax">صفاقس</option>
                <option value="sousse">سوسة</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 2 */}
      {step === 2 && (
        <div className="step-content">
          <h2>التفاصيل والتواريخ</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>تاريخ الفتح:</label>
              <input 
                type="datetime-local"
                name="opening_date"
                value={tenderData.opening_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>تاريخ الإغلاق:</label>
              <input 
                type="datetime-local"
                name="closing_date"
                value={tenderData.closing_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {dateConflict && (
            <div className="alert alert-warning">{dateConflict}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>الميزانية القصوى:</label>
              <input 
                type="number"
                name="budget_max"
                value={tenderData.budget_max}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>العملة:</label>
              <select name="currency" value={tenderData.currency} onChange={handleInputChange}>
                <option value="TND">د.ت</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 3 */}
      {step === 3 && (
        <div className="step-content">
          <h2>البنود والمواصفات</h2>
          
          {tenderData.items.map((item, idx) => (
            <div key={idx} className="item-card">
              <h3>البند {idx + 1}</h3>
              <div className="form-group">
                <label>اسم البند:</label>
                <input 
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                  placeholder="مثال: شاشة 27 بوصة"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الكمية:</label>
                  <input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>المواصفات التقنية:</label>
                  <input 
                    type="text"
                    value={item.specifications}
                    onChange={(e) => handleItemChange(idx, 'specifications', e.target.value)}
                    placeholder="مثال: دقة 4K، لون عالي"
                  />
                </div>
              </div>
            </div>
          ))}

          <button className="btn btn-secondary" onClick={handleAddItem}>
            + إضافة بند جديد
          </button>
        </div>
      )}

      {/* الخطوة 4 - المراجعة */}
      {step === 4 && (
        <div className="step-content">
          <h2>مراجعة المناقصة</h2>
          
          <div className="review-section">
            <h3>{tenderData.title}</h3>
            <p>{tenderData.description}</p>
            <p><strong>الفئة:</strong> {tenderData.category}</p>
            <p><strong>الموقع:</strong> {tenderData.location}</p>
            <p><strong>الميزانية:</strong> {tenderData.budget_max} {tenderData.currency}</p>
            <p><strong>من:</strong> {new Date(tenderData.opening_date).toLocaleString('ar-TN')}</p>
            <p><strong>إلى:</strong> {new Date(tenderData.closing_date).toLocaleString('ar-TN')}</p>
            
            <h4>البنود:</h4>
            <ul>
              {tenderData.items.map((item, idx) => (
                <li key={idx}>{item.name} × {item.quantity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* أزرار التنقل */}
      <div className="step-buttons">
        <button 
          className="btn btn-secondary"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          السابق
        </button>

        {step < 4 ? (
          <button 
            className="btn btn-primary"
            onClick={() => setStep(step + 1)}
          >
            التالي
          </button>
        ) : (
          <button 
            className="btn btn-success"
            onClick={handleSubmit}
          >
            إنشاء المناقصة
          </button>
        )}
      </div>
    </div>
  );
}
