// Charts for Skoolis Dashboard
let savedGradesChartInstance = null;
let savedAttendanceChartInstance = null;

function destroyExistingChart(canvas) {
    if (!canvas || typeof Chart === 'undefined' || !Chart.getChart) return;
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
}

function initSkoolisCharts() {
    // Éviter complètement les réinitialisations multiples
    if (window.__skoolisChartsInitialized) {
        return;
    }

    // Initialize grades chart
    const gradesCtx = document.getElementById('gradesChart');
    
    if (gradesCtx) {
        // Vérifier si un graphique existe déjà sur ce canvas
        const existingChart = Chart.getChart(gradesCtx);
        if (existingChart) {
            // Sauvegarder l'instance pour restauration ultérieure
            savedGradesChartInstance = existingChart;
            window.__skoolisChartsInitialized = true;
            return;
        }
        
        // Si on a une instance sauvegartée, la restaurer
        if (savedGradesChartInstance) {
            // Recréer le graphique avec les mêmes données
            new Chart(gradesCtx, {
                type: savedGradesChartInstance.config.type,
                data: savedGradesChartInstance.data,
                options: savedGradesChartInstance.options
            });
            window.__skoolisChartsInitialized = true;
            return;
        }
        
        destroyExistingChart(gradesCtx);
        // Créer un conteneur parent pour le canvas
        const chartContainer = gradesCtx.parentElement;
        
        // Sample data for the chart
        const gradesChart = new Chart(gradesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                datasets: [
                    {
                        label: '6ème',
                        data: [12.5, 13.2, 12.8, 13.5, 14.1, 13.8, 12.9, 13.2, 13.7, 14.0, 13.9, 14.2],
                        borderColor: '#7b1fa2',
                        backgroundColor: 'rgba(123, 31, 162, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: '4ème',
                        data: [11.8, 12.1, 11.9, 12.5, 12.8, 13.1, 12.5, 12.9, 13.2, 13.5, 13.3, 13.6],
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: 'Terminale',
                        data: [13.2, 13.5, 13.8, 14.1, 14.3, 14.0, 13.7, 13.9, 14.2, 14.5, 14.3, 14.6],
                        borderColor: '#388e3c',
                        backgroundColor: 'rgba(56, 142, 60, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12
                            },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white').trim(),
                        titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                        bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            family: "'Poppins', sans-serif"
                        },
                        bodyFont: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim(),
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            },
                            maxRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 5,
                        max: 20,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim(),
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 11
                            },
                            stepSize: 1,
                            padding: 8
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                elements: {
                    point: {
                        radius: 3,
                        hoverRadius: 5
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }
                }
            }
        });

        // Sauvegarder l'instance
        savedGradesChartInstance = gradesChart;
        
        // Fonction pour mettre à jour les couleurs du thème
        function updateChartTheme() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            gradesChart.options.plugins.legend.labels.color = isDark ? '#f5f5f5' : '#333333';
            gradesChart.options.plugins.tooltip.backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
            gradesChart.options.plugins.tooltip.titleColor = isDark ? '#f5f5f5' : '#333333';
            gradesChart.options.plugins.tooltip.bodyColor = isDark ? '#f5f5f5' : '#333333';
            gradesChart.options.scales.x.ticks.color = isDark ? '#cccccc' : '#666666';
            gradesChart.options.scales.x.grid.color = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
            gradesChart.options.scales.y.ticks.color = isDark ? '#cccccc' : '#666666';
            gradesChart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
            
            gradesChart.update();
        }
        
        // Update chart colors when theme changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'data-theme') {
                    updateChartTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
        
        // Redimensionner le graphique lors du redimensionnement de la fenêtre
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                gradesChart.resize();
                gradesChart.update();
            }, 250);
        }
        
        window.addEventListener('resize', handleResize);
    }
    
    // Initialize attendance chart if needed
    const attendanceCtx = document.getElementById('attendanceChart');
    
    if (attendanceCtx) {
        // Vérifier si un graphique existe déjà
        const existingAttendanceChart = Chart.getChart(attendanceCtx);
        if (existingAttendanceChart) {
            window.__skoolisChartsInitialized = true;
            return;
        }
        
        destroyExistingChart(attendanceCtx);
        new Chart(attendanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Présents', 'Absents', 'Retards'],
                datasets: [{
                    data: [85, 10, 5],
                    backgroundColor: [
                        '#4caf50',
                        '#f44336',
                        '#ff9800'
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--white').trim(),
                        titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                        bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + '%';
                                return label;
                            }
                        }
                    }
                },
                cutout: '65%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // Marquer comme initialisé
    window.__skoolisChartsInitialized = true;
}

window.__initSkoolisCharts = initSkoolisCharts;

if (!window.__skoolisChartsBootstrapped) {
    window.__skoolisChartsBootstrapped = true;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkoolisCharts, { once: true });
    } else {
        setTimeout(initSkoolisCharts, 0);
    }
}

// Flag pour éviter les réinitialisations multiples depuis le conteneur React
window.__skoolisChartsInitialized = false;