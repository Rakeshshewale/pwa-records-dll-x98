// Expense Tracker Frontend Logic (app.js)
document.addEventListener('DOMContentLoaded', () => {
  const authToken = "Rakesh9869";

  // Category options mapping
  const categoryOptions = {
    "Shopping": ["Amazon", "Shopping mart", "Electronics", "Clothing", "Other"],
    "Food": ["Dining out", "Snacks", "Food deliveries", "Groceries", "Fruit"],
    "Transportation": ["Public transport", "Cab", "Flight/Hotel", "Rental vehicle", "Other"],
    "Bills": ["Electricity", "Rent", "Phone bills", "Cable", "Other"],
    "Entertainment": ["Ytube+", "Apple account", "Outings", "Movies", "Other"],
    "Personal care": ["Medical", "Hair saloon spa", "Cosmetics", "Dr appointments", "Other"],
    "Insurance": ["LIC", "Health Insurance", "Term Insurance"],
    "Other Expenses": ["Splitwise pay", "Laundry", "Career", "Vacation", "Other"],
    "Money transfer": [
      "Salary to Kotak", "ICICI to Kotak", "Kotak to ICICI", "Cash withdrawal", "Salary",
      "Investment", "Other income", "E-wallet topup"
    ],
    "Opening balance": ["E-wallet balance", "ICICI balance", "HDFC balance", "Kotak Balance", "Cash"]
  };

  // DOM elements
  const categorySelect = document.getElementById('category');
  const categoryValueSelect = document.getElementById('categoryValue');
  const expenseForm = document.getElementById('expenseForm');
  const resultDiv = document.getElementById('result');
  const submitBtn = expenseForm.querySelector('button[type="submit"]');

  // Populate category dropdown
  Object.keys(categoryOptions).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  // Populate subcategory based on category
  categorySelect.addEventListener('change', () => {
    const selected = categorySelect.value;
    categoryValueSelect.innerHTML = '<option value="">-- Select --</option>';
    if (categoryOptions[selected]) {
      categoryOptions[selected].forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        categoryValueSelect.appendChild(opt);
      });
    }
  });

  // Handle form submission
  expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      authToken,
      transactionType: document.querySelector('input[name="transactionType"]:checked')?.value,
      expenseMode: document.querySelector('input[name="expenseMode"]:checked')?.value || '',
      category: categorySelect.value,
      categoryValue: categoryValueSelect.value,
      amount: document.getElementById('amount').value,
      additionalInfo: document.getElementById('additionalInfo').value || ''
    };

    // Validate required fields
    if (!formData.transactionType || !formData.amount || !formData.category || !formData.categoryValue) {
      showMessage('Please fill all required fields.', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    resultDiv.style.display = 'none';

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxfnsjylsIyAM39N1-WMvxOer6DMuNpoA6A4cBwVy4efqkxyBAeoNlhxaaVhWmNmSPr/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.status === 'success') {
        showMessage(result.message || 'Entry submitted successfully!', 'success');
        expenseForm.reset();
        categoryValueSelect.innerHTML = '<option value="">-- Select Category First --</option>';
      } else {
        showMessage(result.message || 'Server error', 'error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      showMessage(err.message || 'Submission failed.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });

  // Helper function to display messages
  function showMessage(msg, type) {
    resultDiv.textContent = msg;
    resultDiv.className = type;
    resultDiv.style.display = 'block';
    setTimeout(() => {
      resultDiv.style.display = 'none';
    }, 5000);
  }
});
