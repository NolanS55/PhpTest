

const titleField = document.getElementById('contactTitle')
titleField.style.display = 'none';

document.getElementById('accountType').addEventListener('change', function () {
  const label = document.getElementById('fullNameLabel');
  const titleField = document.getElementById('contactTitle');

  if (this.value === 'Company') {
    label.textContent = 'Contact Name:';
    titleField.style.display = 'block';
  } else {
    label.textContent = 'Full Name:';
    titleField.style.display = 'none';
  }
});

document.getElementById('regForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const response = await fetch('http://localhost:8000/server.php', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  const messageBox = document.getElementById('responseMessage')

    if (result.success) {
        const now = new Date();
        messageBox.style.color = 'green';
        messageBox.textContent = result.message + " at " + now.toString();
    } else {
        messageBox.style.color = 'red';
        messageBox.textContent = result.message;
    }
});

