const tooltip = document.getElementById('tooltip');

// Attach event listeners to images
document.querySelectorAll('.hover-image').forEach((img) => {
    img.addEventListener('mousemove', (e) => {
        // Update tooltip position
        tooltip.style.left = `${e.pageX + 10}px`; // Adjust offset
        tooltip.style.top = `${e.pageY + 10}px`; // Adjust offset
        tooltip.textContent = img.getAttribute('data-tooltip'); // Set tooltip text
        tooltip.style.opacity = 1; // Show tooltip
    });

    img.addEventListener('mouseleave', () => {
        tooltip.style.opacity = 0; // Hide tooltip when leaving the image
    });
});
