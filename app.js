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
    "Salary to Kotak", "Salary to ICICI", "ICICI to Kotak", "Kotak to ICICI", "Cash withdrawal",
    "Salary", "Investment", "Other income", "E-wallet topup"
  ],
  "Opening balance": ["E-wallet balance", "ICICI balance", "HDFC balance", "Kotak Balance", "Cash"]
};

// Initialize category dropdown
document.getElementById('category').addEventListener('change', function() {
  const category = this.value;
  const subcategorySelect = document.getElementById('categoryValue');
  subcategorySelect.innerHTML = '<option value="">-- Select --</option>';

  if (category && categoryOptions[category]) {
    categoryOptions[category].forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      subcategorySelect.appendChild(option);
    });
  }
});

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.querySelector('#expenseForm button[type="submit"]');
  const resultDiv = document.getElementById('result');
  
  try {
    // Get form values
    const formData = {
      authToken: "Rakesh9869",
      transactionType: document.querySelector('input[name="transactionType"]:checked')?.value,
      expenseMode: document.querySelector('input[name="expenseMode"]:checked')?.value || '',
      amount: document.getElementById('amount').value,
      category: document.getElementById('category').value,
      categoryValue: document.getElementById('categoryValue').value,
      additionalInfo: document.getElementById('additionalInfo').value || ''
    };

    // Validate required fields
    if (!formData.transactionType || !formData.amount || !formData.category || !formData.categoryValue) {
      showMessage('All required fields must be filled', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    resultDiv.style.display = 'none';

    // Send to Google Script
    const response = await fetch('YOUR_GOOGLE_SCRIPT_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Server error');
    }

    const result = await response.json();
    showMessage(result.message || 'Entry saved successfully!', 'success');
    
    // Reset form
    document.getElementById('expenseForm').reset();
    document.getElementById('categoryValue').innerHTML = '<option value="">-- Select Category First --</option>';

  } catch (error) {
    showMessage(error.message || 'Failed to save entry. Please try again.', 'error');
    console.error('Submission error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});

// Helper function to show messages
function showMessage(message, type) {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = message;
  resultDiv.className = `alert ${type}`;
  resultDiv.style.display = 'block';

  // Hide message after 5 seconds
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}