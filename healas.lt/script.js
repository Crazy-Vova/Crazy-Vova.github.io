// burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('menu');
const body = document.body;
const navItems = document.querySelectorAll('#menu a, #menu .basic-button');

const toggleMenu = () => {
    nav.classList.toggle('active');
    burger.classList.toggle('toggle');
    body.classList.toggle('no-scroll');
};

if (burger && nav) {
    burger.addEventListener('click', toggleMenu);
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            body.classList.remove('no-scroll');
        }
    });
});


// cards
const cards = document.querySelectorAll('.card');
const badgeTemplate = document.getElementById('badge-template');

const moveBadge = (targetCard) => {
    if (!badgeTemplate) return;
    const currentBadge = document.querySelector('.card__badge');
    if (currentBadge) {
        currentBadge.remove();
    }
    const badgeClone = badgeTemplate.content.cloneNode(true);
    targetCard.insertBefore(badgeClone, targetCard.firstChild);
};

// active card on load
const initialActiveCard = document.querySelector('.card--active');
if (initialActiveCard) {
    moveBadge(initialActiveCard);
}

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('card__button')) return;

        if (card.classList.contains('card--active')) return;

        cards.forEach(c => c.classList.remove('card--active'));
        card.classList.add('card--active');
        moveBadge(card);
    });
});


// modal window
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalForm = document.querySelector('.modal-form');
const modalPlanSelect = document.getElementById('modalPlan');
const toast = document.getElementById('toastNotification');

const openModalButtons = document.querySelectorAll('.basic-button, .card__button');

const openModal = () => {
    if (modalOverlay) {
        modalOverlay.classList.add('modal--open');
        body.classList.add('no-scroll');
    }
};

const closeModal = () => {
    if (modalOverlay) {
        modalOverlay.classList.remove('modal--open');
        if (nav && !nav.classList.contains('active')) {
            body.classList.remove('no-scroll');
        }
        resetFormErrors();
    }
};

const resetFormErrors = () => {
    if (modalForm) {
        modalForm.reset();
    }
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('input--error'));
};

openModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 

        if (modalPlanSelect) {
            const card = button.closest('.card');
            if (card) {
                const planTitle = card.querySelector('.card__title').textContent.trim().toLowerCase();
                modalPlanSelect.value = planTitle;
            } else {
                modalPlanSelect.value = 'standard';
            }
        }
        openModal();
    });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
}
document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('modal--open')) {
        closeModal(); 
    }
});

// submit
const showFieldError = (inputElement, message) => {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.add('input--error');
    
    if (!formGroup.querySelector('.error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
};

if (modalForm) {
    modalForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup && formGroup.classList.contains('input--error')) {
                formGroup.classList.remove('input--error');
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });
    });

    const submitBtn = modalForm.querySelector('.form-submit-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
           
            let isValid = true;
            const nameInput = document.getElementById('modalName');
            const emailInput = document.getElementById('modalEmail');

            document.querySelectorAll('.error-message').forEach(msg => msg.remove());
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('input--error'));

            if (!nameInput || nameInput.value.trim() === '') {
                showFieldError(nameInput, 'Name is required');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showFieldError(nameInput, 'Name must be at least 2 characters long');
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || emailInput.value.trim() === '') {
                showFieldError(emailInput, 'Email is required');
                isValid = false;
            } else if (!emailPattern.test(emailInput.value.trim())) {
                showFieldError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }


            if (isValid) {
                closeModal(); 
                
                if (toast) {
                    toast.classList.add('toast--show');
                    setTimeout(() => {
                        toast.classList.remove('toast--show'); 
                    }, 3000);
                } else {
                    alert('Request submitted!'); 
                }
            }
        });
    } else {
    }
}