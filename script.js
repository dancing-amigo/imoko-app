const BEAD_TYPES = [
    // Small beads
    { name: 'ruby-small', shape: 'circle', size: 'small', color: '#e74c3c', gradient: ['#c0392b', '#e74c3c', '#ff6b6b'] },
    { name: 'sapphire-small', shape: 'circle', size: 'small', color: '#3498db', gradient: ['#2874a6', '#3498db', '#5dade2'] },
    { name: 'emerald-small', shape: 'circle', size: 'small', color: '#2ecc71', gradient: ['#239b56', '#2ecc71', '#58d68d'] },
    { name: 'onyx-small', shape: 'square', size: 'small', color: '#2c3e50', gradient: ['#1a1a1a', '#2c3e50', '#34495e'] },
    { name: 'coral-small', shape: 'triangle', size: 'small', color: '#ff7f50', gradient: ['#ff6347', '#ff7f50', '#ffa07a'] },

    // Medium beads
    { name: 'ruby', shape: 'circle', size: 'medium', color: '#e74c3c', gradient: ['#c0392b', '#e74c3c', '#ff6b6b'] },
    { name: 'sapphire', shape: 'circle', size: 'medium', color: '#3498db', gradient: ['#2874a6', '#3498db', '#5dade2'] },
    { name: 'emerald', shape: 'circle', size: 'medium', color: '#2ecc71', gradient: ['#239b56', '#2ecc71', '#58d68d'] },
    { name: 'amethyst', shape: 'circle', size: 'medium', color: '#9b59b6', gradient: ['#7d3c98', '#9b59b6', '#bb8fce'] },
    { name: 'topaz', shape: 'circle', size: 'medium', color: '#f39c12', gradient: ['#d68910', '#f39c12', '#f5b041'] },
    { name: 'pearl', shape: 'circle', size: 'medium', color: '#ecf0f1', gradient: ['#bfc9ca', '#ecf0f1', '#ffffff'] },
    { name: 'onyx', shape: 'square', size: 'medium', color: '#2c3e50', gradient: ['#1a1a1a', '#2c3e50', '#34495e'] },
    { name: 'rose', shape: 'square', size: 'medium', color: '#ff69b4', gradient: ['#ff1493', '#ff69b4', '#ffb6c1'] },
    { name: 'jade', shape: 'square', size: 'medium', color: '#00a86b', gradient: ['#008856', '#00a86b', '#00c878'] },
    { name: 'coral', shape: 'triangle', size: 'medium', color: '#ff7f50', gradient: ['#ff6347', '#ff7f50', '#ffa07a'] },
    { name: 'turquoise', shape: 'triangle', size: 'medium', color: '#40e0d0', gradient: ['#00ced1', '#40e0d0', '#48d1cc'] },
    { name: 'gold', shape: 'triangle', size: 'medium', color: '#ffd700', gradient: ['#ffb900', '#ffd700', '#ffed4e'] },
    { name: 'silver', shape: 'hexagon', size: 'medium', color: '#c0c0c0', gradient: ['#a8a8a8', '#c0c0c0', '#d3d3d3'] },
    { name: 'bronze', shape: 'hexagon', size: 'medium', color: '#cd7f32', gradient: ['#b8682a', '#cd7f32', '#d4994f'] },
    { name: 'obsidian', shape: 'star', size: 'medium', color: '#3d3d3d', gradient: ['#1a1a1a', '#3d3d3d', '#4d4d4d'] },
    { name: 'crystal', shape: 'star', size: 'medium', color: '#e0e0ff', gradient: ['#c0c0ff', '#e0e0ff', '#f0f0ff'] },

    // Large beads
    { name: 'ruby-large', shape: 'circle', size: 'large', color: '#e74c3c', gradient: ['#c0392b', '#e74c3c', '#ff6b6b'] },
    { name: 'amethyst-large', shape: 'circle', size: 'large', color: '#9b59b6', gradient: ['#7d3c98', '#9b59b6', '#bb8fce'] },
    { name: 'pearl-large', shape: 'circle', size: 'large', color: '#ecf0f1', gradient: ['#bfc9ca', '#ecf0f1', '#ffffff'] },
    { name: 'silver-large', shape: 'hexagon', size: 'large', color: '#c0c0c0', gradient: ['#a8a8a8', '#c0c0c0', '#d3d3d3'] },
    { name: 'obsidian-large', shape: 'star', size: 'large', color: '#3d3d3d', gradient: ['#1a1a1a', '#3d3d3d', '#4d4d4d'] }
];

const BRACELET_SLOTS = 20;
const BASE_COLOR = '#8b4513';

class BraceletApp {
    constructor() {
        this.canvas = document.getElementById('braceletCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.beadSlots = [];
        this.braceletBeads = new Array(BRACELET_SLOTS).fill(null);
        this.draggedBead = null;
        this.isDragging = false;
        this.selectedSlot = -1;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createBeadSelector();
        this.calculateSlotPositions();
        this.render();
        this.setupEventListeners();

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.calculateSlotPositions();
            this.render();
        });
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth * 0.8, container.clientHeight * 0.8, 400);

        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.baseRadius = size / 2 - 30;
        this.beadRadius = 15;
    }

    calculateSlotPositions() {
        this.beadSlots = [];
        const angleStep = (Math.PI * 2) / BRACELET_SLOTS;

        for (let i = 0; i < BRACELET_SLOTS; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = this.centerX + Math.cos(angle) * (this.baseRadius - 25);
            const y = this.centerY + Math.sin(angle) * (this.baseRadius - 25);
            this.beadSlots.push({ x, y, angle });
        }
    }

    createBeadSelector() {
        const beadList = document.getElementById('beadList');
        beadList.innerHTML = '';

        BEAD_TYPES.forEach((bead, index) => {
            const beadElement = document.createElement('div');
            beadElement.className = `bead-item bead-${bead.shape} bead-${bead.size}`;
            beadElement.dataset.beadIndex = index;

            if (bead.shape === 'circle' || bead.shape === 'square' || bead.shape === 'hexagon' || bead.shape === 'star') {
                beadElement.style.background = `radial-gradient(circle at 30% 30%, ${bead.gradient[2]}, ${bead.gradient[1]} 40%, ${bead.gradient[0]} 100%)`;
            } else if (bead.shape === 'triangle') {
                beadElement.style.borderBottomColor = bead.gradient[1];
            }

            beadElement.draggable = true;
            beadList.appendChild(beadElement);
        });
    }

    setupEventListeners() {
        const beadItems = document.querySelectorAll('.bead-item');

        beadItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));

            item.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            item.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            item.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        });

        this.canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));

        this.canvas.addEventListener('touchmove', (e) => this.handleCanvasTouchMove(e), { passive: false });

        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    handleDragStart(e) {
        const beadIndex = parseInt(e.target.dataset.beadIndex);
        this.draggedBead = BEAD_TYPES[beadIndex];
        e.target.classList.add('dragging');

        const dragImage = new Image();
        dragImage.src = 'data:image/svg+xml,<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"></svg>';
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        e.dataTransfer.effectAllowed = 'copy';

        this.createMouseDragPreview(e.clientX, e.clientY, this.draggedBead);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedBead = null;
        this.removeMouseDragPreview();
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.highlightNearestSlot(e.offsetX, e.offsetY);
        if (this.mouseDragPreview) {
            this.updateMouseDragPreview(e.clientX, e.clientY);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        if (this.draggedBead && this.selectedSlot >= 0) {
            this.braceletBeads[this.selectedSlot] = this.draggedBead;
            this.render();
        }
        this.selectedSlot = -1;
        this.removeMouseDragPreview();
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const beadIndex = parseInt(e.target.dataset.beadIndex);
        this.draggedBead = BEAD_TYPES[beadIndex];
        this.isDragging = true;
        e.target.classList.add('dragging');

        this.createDragPreview(touch.clientX, touch.clientY, this.draggedBead);
    }

    handleTouchMove(e) {
        if (!this.isDragging || !this.draggedBead) return;
        e.preventDefault();

        const touch = e.touches[0];
        this.updateDragPreview(touch.clientX, touch.clientY);

        const rect = this.canvas.getBoundingClientRect();
        const canvasX = touch.clientX - rect.left;
        const canvasY = touch.clientY - rect.top;

        if (canvasX >= 0 && canvasX <= this.canvas.width &&
            canvasY >= 0 && canvasY <= this.canvas.height) {
            this.highlightNearestSlot(canvasX, canvasY);
        }
    }

    handleTouchEnd(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const beadItem = e.target;
        beadItem.classList.remove('dragging');

        this.removeDragPreview();

        if (this.selectedSlot >= 0 && this.draggedBead) {
            this.braceletBeads[this.selectedSlot] = this.draggedBead;
            this.render();
        }

        this.isDragging = false;
        this.draggedBead = null;
        this.selectedSlot = -1;
    }

    handleCanvasTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedSlot = this.getClickedSlot(x, y);
        if (clickedSlot >= 0) {
            this.braceletBeads[clickedSlot] = null;
            this.render();
        }
    }

    getClickedSlot(x, y) {
        for (let i = 0; i < this.beadSlots.length; i++) {
            const slot = this.beadSlots[i];
            const distance = Math.sqrt(Math.pow(x - slot.x, 2) + Math.pow(y - slot.y, 2));
            if (distance <= this.beadRadius && this.braceletBeads[i]) {
                return i;
            }
        }
        return -1;
    }

    createDragPreview(x, y, bead) {
        const preview = document.createElement('div');
        preview.className = `drag-preview drag-${bead.shape}`;

        if (bead.shape === 'circle' || bead.shape === 'square' || bead.shape === 'hexagon' || bead.shape === 'star') {
            preview.style.background = `radial-gradient(circle at 30% 30%, ${bead.gradient[2]}, ${bead.gradient[1]} 40%, ${bead.gradient[0]} 100%)`;
        } else if (bead.shape === 'triangle') {
            preview.style.borderBottomColor = bead.gradient[1];
        }

        preview.style.left = `${x - 25}px`;
        preview.style.top = `${y - 25}px`;
        document.body.appendChild(preview);
        this.dragPreview = preview;
    }

    createMouseDragPreview(x, y, bead) {
        const preview = document.createElement('div');
        preview.className = `drag-preview drag-${bead.shape}`;

        if (bead.shape === 'circle' || bead.shape === 'square' || bead.shape === 'hexagon' || bead.shape === 'star') {
            preview.style.background = `radial-gradient(circle at 30% 30%, ${bead.gradient[2]}, ${bead.gradient[1]} 40%, ${bead.gradient[0]} 100%)`;
        } else if (bead.shape === 'triangle') {
            preview.style.borderBottomColor = bead.gradient[1];
        }

        preview.style.left = `${x - 25}px`;
        preview.style.top = `${y - 25}px`;
        document.body.appendChild(preview);
        this.mouseDragPreview = preview;
    }

    updateDragPreview(x, y) {
        if (this.dragPreview) {
            this.dragPreview.style.left = `${x - 25}px`;
            this.dragPreview.style.top = `${y - 25}px`;
        }
    }

    updateMouseDragPreview(x, y) {
        if (this.mouseDragPreview) {
            this.mouseDragPreview.style.left = `${x - 25}px`;
            this.mouseDragPreview.style.top = `${y - 25}px`;
        }
    }

    removeDragPreview() {
        if (this.dragPreview) {
            this.dragPreview.remove();
            this.dragPreview = null;
        }
    }

    removeMouseDragPreview() {
        if (this.mouseDragPreview) {
            this.mouseDragPreview.remove();
            this.mouseDragPreview = null;
        }
    }

    highlightNearestSlot(x, y) {
        let minDistance = Infinity;
        let nearestSlot = -1;

        for (let i = 0; i < this.beadSlots.length; i++) {
            const slot = this.beadSlots[i];
            const distance = Math.sqrt(Math.pow(x - slot.x, 2) + Math.pow(y - slot.y, 2));

            if (distance < minDistance && distance < 50) {
                minDistance = distance;
                nearestSlot = i;
            }
        }

        if (this.selectedSlot !== nearestSlot) {
            this.selectedSlot = nearestSlot;
            this.render();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBase();
        this.drawSlots();
        this.drawBeads();
    }

    drawBase() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.baseRadius, 0, Math.PI * 2);

        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, this.baseRadius * 0.5,
            this.centerX, this.centerY, this.baseRadius
        );
        gradient.addColorStop(0, '#a0522d');
        gradient.addColorStop(0.5, '#8b4513');
        gradient.addColorStop(1, '#654321');

        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.strokeStyle = '#5c3317';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.baseRadius * 0.85, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#7a5230';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    drawSlots() {
        // Remove slot outline drawing - no visual indicators for slots
    }

    drawBeads() {
        this.braceletBeads.forEach((bead, index) => {
            if (!bead) return;

            const slot = this.beadSlots[index];

            // Calculate bead size based on size property
            let beadRadius = this.beadRadius;
            if (bead.size === 'small') {
                beadRadius = this.beadRadius * 0.6;
            } else if (bead.size === 'large') {
                beadRadius = this.beadRadius * 1.4;
            }

            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;

            if (bead.shape === 'circle') {
                const gradient = this.ctx.createRadialGradient(
                    slot.x - beadRadius * 0.3, slot.y - beadRadius * 0.3, 0,
                    slot.x, slot.y, beadRadius
                );
                gradient.addColorStop(0, bead.gradient[2]);
                gradient.addColorStop(0.5, bead.gradient[1]);
                gradient.addColorStop(1, bead.gradient[0]);

                this.ctx.beginPath();
                this.ctx.arc(slot.x, slot.y, beadRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();

                this.drawHighlight(slot.x - beadRadius * 0.3, slot.y - beadRadius * 0.3, beadRadius * 0.3);

            } else if (bead.shape === 'square') {
                const size = beadRadius * 1.5;
                const gradient = this.ctx.createRadialGradient(
                    slot.x, slot.y, 0,
                    slot.x, slot.y, size
                );
                gradient.addColorStop(0, bead.gradient[2]);
                gradient.addColorStop(0.5, bead.gradient[1]);
                gradient.addColorStop(1, bead.gradient[0]);

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(slot.x - size/2, slot.y - size/2, size, size);

                this.drawHighlight(slot.x - size/3, slot.y - size/3, size * 0.2);

            } else if (bead.shape === 'triangle') {
                this.ctx.translate(slot.x, slot.y);

                const gradient = this.ctx.createLinearGradient(0, -beadRadius, 0, beadRadius);
                gradient.addColorStop(0, bead.gradient[2]);
                gradient.addColorStop(0.5, bead.gradient[1]);
                gradient.addColorStop(1, bead.gradient[0]);

                this.ctx.beginPath();
                this.ctx.moveTo(0, -beadRadius);
                this.ctx.lineTo(-beadRadius, beadRadius);
                this.ctx.lineTo(beadRadius, beadRadius);
                this.ctx.closePath();
                this.ctx.fillStyle = gradient;
                this.ctx.fill();

            } else if (bead.shape === 'hexagon') {
                this.ctx.translate(slot.x, slot.y);

                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, beadRadius);
                gradient.addColorStop(0, bead.gradient[2]);
                gradient.addColorStop(0.5, bead.gradient[1]);
                gradient.addColorStop(1, bead.gradient[0]);

                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const x = beadRadius * Math.cos(angle);
                    const y = beadRadius * Math.sin(angle);
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.fillStyle = gradient;
                this.ctx.fill();

            } else if (bead.shape === 'star') {
                this.ctx.translate(slot.x, slot.y);

                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, beadRadius);
                gradient.addColorStop(0, bead.gradient[2]);
                gradient.addColorStop(0.5, bead.gradient[1]);
                gradient.addColorStop(1, bead.gradient[0]);

                this.ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const radius = i % 2 === 0 ? beadRadius : beadRadius * 0.5;
                    const angle = (Math.PI / 5) * i - Math.PI / 2;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }

            this.ctx.restore();
        });
    }

    drawHighlight(x, y, radius) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        const highlight = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = highlight;
        this.ctx.fill();
        this.ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BraceletApp();
});