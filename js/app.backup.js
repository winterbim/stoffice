// Stoffice App Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('Stoffice Check Executed');

    const form = document.getElementById('calculation-form');
    const resultsContent = document.getElementById('results-content');
    const resultsPlaceholder = document.querySelector('.results-placeholder');

    // Auto-calculate on input change
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateResults);
        input.addEventListener('change', calculateResults);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateResults();
    });

    function calculateResults() {
        const data = new FormData(form);
        const values = Object.fromEntries(data.entries());

        // Parse Inputs
        const days = Number(values.daysPerYear) || 0;
        const incidents = Number(values.incidentsPerDay) || 0;
        const mins = Number(values.minutesPerIncident) || 0;
        const rate = Number(values.hourlyRate) || 0;

        // Base Status Quo Calculation
        // Formula: (Incidents * Minutes / 60) * Days * Rate
        // E25 in Excel
        const hoursPerDay = (incidents * mins) / 60;
        const hoursPerYear = hoursPerDay * days;
        const totalCostCurr = hoursPerYear * rate;

        // Optimization Factors (Assumptions as originals were hidden)
        let savingsPercent = 0;
        if (values.optZwilling) savingsPercent += 0.75; // 75%
        if (values.optAssets) savingsPercent += 0.10;   // 10%
        if (values.optDoku) savingsPercent += 0.05;     // 5%
        if (values.optAuto) savingsPercent += 0.10;     // 10%

        // AI Cost
        const costAI = Number(values.costAI) || 0;

        // Calculations
        const grossSavings = totalCostCurr * savingsPercent;
        const netSavings = grossSavings - costAI;
        const totalCostNew = totalCostCurr - netSavings;

        // Hide placeholder
        resultsPlaceholder.style.display = 'none';
        resultsContent.classList.remove('hidden');

        // Render Results
        const formatCurrency = (num) => {
            return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(num);
        };

        // Construct Logic for display
        let resultsHTML = `
            <div class="result-card">
                <h3><i class="fa-solid fa-money-bill"></i> Aktuelle Jahreskosten</h3>
                <div class="result-value">${formatCurrency(totalCostCurr)}</div>
                <div class="result-sub">${Math.round(hoursPerYear)} Stunden / Jahr</div>
            </div>`;

        if (costAI > 0) {
            resultsHTML += `
            <div class="result-card" style="border-color: var(--text-secondary);">
                <h3><i class="fa-solid fa-robot"></i> AI-Investition</h3>
                <div class="result-value" style="color: var(--text-primary);">- ${formatCurrency(costAI)}</div>
                <div class="result-sub">Einmalige / Jährliche Kosten</div>
            </div>`;
        }

        resultsHTML += `
            <div class="result-card">
                <h3><i class="fa-solid fa-piggy-bank"></i> Nettoeinsparungen</h3>
                <div class="result-value" style="color: #4CAF50;">${formatCurrency(netSavings)}</div>
                <div class="result-sub">Brutto: ${formatCurrency(grossSavings)} (${(savingsPercent * 100).toFixed(0)}%)</div>
            </div>

            <div class="result-card result-highlight">
                <h3><i class="fa-solid fa-wand-magic-sparkles"></i> Optimierte Kosten</h3>
                <div class="result-value">${formatCurrency(totalCostNew)}</div>
                <div class="result-sub">Neue jährliche Schätzung</div>
            </div>
        `;

        resultsContent.innerHTML = resultsHTML;
    }
});
