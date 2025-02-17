tailwind.config = {
	darkMode: 'class',
};

// Utility Functions
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;
const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
	const isDarkMode = document.documentElement.classList.toggle('dark');
	localStorage.setItem('darkMode', isDarkMode);
});

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
	const savedDarkMode = localStorage.getItem('darkMode');
	const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
		.matches;

	if (savedDarkMode !== null) {
		document.documentElement.classList.toggle('dark', savedDarkMode === 'true');
	} else if (systemPrefersDark) {
		document.documentElement.classList.add('dark');
	}
});


// Page Transition Animations
document.querySelectorAll('.page-transition')
	.forEach((el, index) => {
		setTimeout(() => el.classList.add('active'), index * 200);
	});

document.addEventListener('DOMContentLoaded', () => {
	gsap.delayedCall(0.5, () => {
		gsap.to('#loading', {
			opacity: 0,
			duration: 0.5,
			onComplete: () => {
				document.getElementById('loading')
					.style.display = 'none';
			}
		});
	});
});

// Scroll to Top Button
const scrollToTopButton = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
	scrollToTopButton.classList.toggle('show', window.scrollY > 300);
});
scrollToTopButton.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});
window.onload = () => window.scrollTo(0, 0);

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]')
	.forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();
			document.querySelector(this.getAttribute('href'))
				.scrollIntoView({
					behavior: 'smooth'
				});
		});
	});

// Three.js Network Dynamics Scene
const container3D = document.getElementById('threejs-container');
const scene3D = new THREE.Scene();
const camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer3D = new THREE.WebGLRenderer({
	antialias: true
});
renderer3D.setSize(window.innerWidth, window.innerHeight);
container3D.appendChild(renderer3D.domElement);

const nodes3D = [];
const lines3D = [];
const nodeGeometry = new THREE.SphereGeometry(0.05, 32, 32);
const nodeMaterial = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	transparent: true,
	opacity: 0.8
});
const lineMaterial3D = new THREE.LineBasicMaterial({
	color: 0x10b981,
	linewidth: 2
});

for (let i = 0; i < 50; i++) {
	const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
	node.position.set(getRandomNumber(-5, 5), getRandomNumber(-5, 5), getRandomNumber(-5, 5));
	nodes3D.push(node);
	scene3D.add(node);
}

for (let i = 0; i < nodes3D.length; i++) {
	for (let j = i + 1; j < nodes3D.length; j++) {
		if (Math.random() > 0.9) {
			const points = [nodes3D[i].position, nodes3D[j].position];
			const lineGeometry = new THREE.BufferGeometry()
				.setFromPoints(points);
			const line = new THREE.Line(lineGeometry, lineMaterial3D);
			lines3D.push(line);
			scene3D.add(line);
		}
	}
}

camera3D.position.z = 10;

function animate() {
	requestAnimationFrame(animate);

	nodes3D.forEach(node => {
		node.position.x += getRandomNumber(-0.01, 0.01);
		node.position.y += getRandomNumber(-0.01, 0.01);
		node.position.z += getRandomNumber(-0.01, 0.01);
	});

	lines3D.forEach(line => {
		line.geometry.attributes.position.needsUpdate = true;
	});

	renderer3D.render(scene3D, camera3D);
}

animate();

window.addEventListener('resize', () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer3D.setSize(width, height);
	camera3D.aspect = width / height;
	camera3D.updateProjectionMatrix();
});

// Data Fetching and Updating
async function fetchData() {
	try {
		const response = await fetch('data.php');
		const data = await response.json();
		const elements = [
			'dataProcessed', 'noiseFiltered', 'activeNodes', 'localData',
			'predictionsMade', 'accuracy', 'contentGenerated', 'languagesSupported',
			'networkNodes', 'networkData'
		];

		elements.forEach(id => {
			const element = document.getElementById(id);
			const oldValue = element.textContent;
			if (oldValue !== data[id]) {
				animateValueChange(element, data[id]);
			}
		});
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

function animateValueChange(element, newValue) {
	element.style.transform = 'translateY(0)';
	requestAnimationFrame(() => {
		element.classList.add('move-up');
		setTimeout(() => {
			const parsedValue = parseFloat(newValue);
			element.textContent = Number.isInteger(parsedValue) ? parsedValue : parsedValue.toFixed(2);
			element.classList.remove('move-up');
		}, 500);
	});
}

setInterval(fetchData, 1000);
fetchData();

// Demo Modal Functions
const demoModal = document.getElementById('demoModal');
const showDemoBtn = document.getElementById('showDemoBtn');
const closeDemoBtn = document.getElementById('closeDemoBtn');
const rawSignalCanvas = document.getElementById('rawSignalChart');
const filteredSignalCanvas = document.getElementById('filteredSignalChart');

showDemoBtn.addEventListener('click', () => {
	demoModal.classList.remove('hidden');
	drawSignalCharts();
});
closeDemoBtn.addEventListener('click', () => demoModal.classList.add('hidden'));

function generateRandomSignal(length) {
	const signal = [];
	for (let i = 0; i < length; i++) {
		signal.push(Math.sin(i * 0.1) + (Math.random() - 0.5) * 0.5);
	}
	return signal;
}

function filterAndEnhanceSignal(signal) {
	return signal.map((value, index) => Math.sin(index * 0.1) + (value - Math.sin(index * 0.1)) * 0.2);
}

function drawSignalCharts() {
	const rawSignalCtx = rawSignalCanvas.getContext('2d');
	const filteredSignalCtx = filteredSignalCanvas.getContext('2d');

	const updateCharts = () => {
		rawSignalCtx.clearRect(0, 0, rawSignalCanvas.width, rawSignalCanvas.height);
		filteredSignalCtx.clearRect(0, 0, filteredSignalCanvas.width, filteredSignalCanvas.height);

		const rawSignal = generateRandomSignal(100);
		const filteredSignal = filterAndEnhanceSignal(rawSignal);

		const drawChart = (ctx, signal, color) => {
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			signal.forEach((value, index) => {
				const x = (index / signal.length) * rawSignalCanvas.width;
				const y = (1 - (value + 1) / 2) * rawSignalCanvas.height;
				index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
			});
			ctx.stroke();
		};

		drawChart(rawSignalCtx, rawSignal, '#6366f1');
		drawChart(filteredSignalCtx, filteredSignal, '#10b981');
	};

	// Update charts every second
	setInterval(updateCharts, 1000);
}

// Network Demo Modal Functions
const networkDemoModal = document.getElementById('networkDemoModal');
const showNetworkDemoBtn = document.getElementById('showNetworkDemoBtn');
const closeNetworkDemoBtn = document.getElementById('closeNetworkDemoBtn');
const networkCanvas = document.getElementById('networkCanvas');

showNetworkDemoBtn.addEventListener('click', () => {
	networkDemoModal.classList.remove('hidden');
	drawNetwork();
});
closeNetworkDemoBtn.addEventListener('click', () => networkDemoModal.classList.add('hidden'));

function generateNodes(count) {
	const nodes = [];
	for (let i = 0; i < count; i++) {
		nodes.push({
			x: Math.random() * networkCanvas.width,
			y: Math.random() * networkCanvas.height,
			connections: [],
			data: getRandomInteger(0, 100)
		});
	}
	return nodes;
}

function generateConnections(nodes) {
	nodes.forEach((node, index) => {
		for (let i = 0; i < nodes.length; i++) {
			if (i !== index && Math.random() < 0.3) {
				node.connections.push(nodes[i]);
			}
		}
	});
}

function drawNetwork() {
	const ctx = networkCanvas.getContext('2d');
	const nodeRadius = 5;
	const nodeColor = '#10b981';
	const nodeStrokeColor = '#0f766e';
	const textColor = '#0f766e';
	const connectionColor = '#10b981';
	const connectionLineWidth = 1;
	const fontSize = '10px Arial';

	const nodes = generateNodes(20);
	generateConnections(nodes);

	const drawNode = (node) => {
		ctx.beginPath();
		ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
		ctx.fillStyle = nodeColor;
		ctx.fill();
		ctx.strokeStyle = nodeStrokeColor;
		ctx.stroke();

		ctx.fillStyle = textColor;
		ctx.font = fontSize;
		ctx.fillText(node.data, node.x + 8, node.y + 5);
	};

	const drawConnection = (node, connection) => {
		ctx.beginPath();
		ctx.moveTo(node.x, node.y);
		ctx.lineTo(connection.x, connection.y);
		ctx.strokeStyle = connectionColor;
		ctx.lineWidth = connectionLineWidth;
		ctx.stroke();
	};

	setInterval(() => {
		ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

		nodes.forEach(node => {
			node.x += getRandomNumber(-1, 1);
			node.y += getRandomNumber(-1, 1);
			node.data = getRandomInteger(0, 100);
		});

		nodes.forEach(node => {
			node.connections.forEach(connection => drawConnection(node, connection));
			drawNode(node);
		});

	}, 1000);
}

// Learning Demo Modal Functions
const learningDemoModal = document.getElementById('learningDemoModal');
const showLearningDemoBtn = document.getElementById('showLearningDemoBtn');
const closeLearningDemoBtn = document.getElementById('closeLearningDemoBtn');
const trainingChartCanvas = document.getElementById('trainingChart');
const predictionsContainer = document.getElementById('predictionsContainer');

showLearningDemoBtn.addEventListener('click', () => {
	learningDemoModal.classList.remove('hidden');
	startTraining();
});
closeLearningDemoBtn.addEventListener('click', () => learningDemoModal.classList.add('hidden'));

let accuracyData = [];
let predictions = [];

function drawTrainingChart() {
	const ctx = trainingChartCanvas.getContext('2d');
	ctx.clearRect(0, 0, trainingChartCanvas.width, trainingChartCanvas.height);

	// Grid lines
	ctx.strokeStyle = '#e5e7eb';
	ctx.lineWidth = 0.5;
	for (let i = 0; i <= 10; i++) {
		const y = (i / 10) * trainingChartCanvas.height;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(trainingChartCanvas.width, y);
		ctx.stroke();
	}

	// Accuracy line
	ctx.strokeStyle = '#8b5cf6';
	ctx.lineWidth = 2;
	ctx.beginPath();
	accuracyData.forEach((value, index) => {
		const x = (index / (accuracyData.length - 1)) * trainingChartCanvas.width;
		const y = (1 - value / 100) * trainingChartCanvas.height;
		index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
	});
	ctx.stroke();
}

function updatePredictions() {
	predictionsContainer.innerHTML = predictions
		.map(prediction => `<p class="text-sm text-gray-600 dark:text-gray-300">${prediction}</p>`)
		.join('');
}

function startTraining() {
	accuracyData = [];
	predictions = [];
	let accuracy = 50;
	let predictionCount = 0;

	const interval = setInterval(() => {
		predictionCount += 400;
		accuracy += (predictionCount / 1200) * (Math.random() * 2);
		accuracy = Math.min(99.99, accuracy);

		accuracyData.push(accuracy);
		const prediction = `Prediction: ${predictionCount} (Accuracy: ${accuracy.toFixed(2)}%)`;
		predictions.push(prediction);

		drawTrainingChart();
		updatePredictions();

		if (accuracyData.length >= 20) {
			clearInterval(interval);
		}
	}, 1000);
}


// Narrative Demo Modal Functions
const narrativeDemoModal = document.getElementById('narrativeDemoModal');
const showNarrativeDemoBtn = document.getElementById('showNarrativeDemoBtn');
const closeNarrativeDemoBtn = document.getElementById('closeNarrativeDemoBtn');
const generateContentBtn = document.getElementById('generateContentBtn');
const generatedContent = document.getElementById('generatedContent');

showNarrativeDemoBtn.addEventListener('click', () => narrativeDemoModal.classList.remove('hidden'));
closeNarrativeDemoBtn.addEventListener('click', () => narrativeDemoModal.classList.add('hidden'));

function generatePlatformContent() {
	const platforms = [{
			name: 'Twitter',
			content: "🚀 AI is revolutionizing industries! From smarter decisions to innovative solutions, the future is here. #AI #TechTrends"
		},
		{
			name: 'LinkedIn',
			content: "The rapid advancement of AI technology is transforming industries worldwide. Excited to see how it enables smarter decision-making and innovative solutions. #AI #Innovation #FutureTech"
		},
		{
			name: 'News Article',
			content: "In a world driven by data, AI is emerging as a game-changer. Industries are leveraging AI to make smarter decisions and develop innovative solutions, paving the way for a brighter future."
		},
		{
			name: 'Blog Post',
			content: "AI technology is no longer a futuristic concept—it's here, and it's transforming industries. From healthcare to finance, AI is enabling smarter decision-making and driving innovation. Let's explore how."
		}
	];

	return platforms.map(platform => `
                <div class="mb-4">
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">${platform.name}:</p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">${platform.content}</p>
                </div>
            `)
		.join('');
}

generateContentBtn.addEventListener('click', () => {
	generatedContent.innerHTML = generatePlatformContent();
});