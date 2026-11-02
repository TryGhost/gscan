(function () {
    function setDisplay(elements, display) {
        elements.forEach(function (element) {
            element.style.display = display;
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const themeInput = document.getElementById('theme');
        const themeSubmit = document.getElementById('theme-submit');

        if (themeInput && themeSubmit) {
            themeSubmit.disabled = !themeInput.files.length;

            themeInput.addEventListener('change', function () {
                themeSubmit.disabled = !themeInput.files.length;
            });
        }

        // Mobile Menu Trigger
        document.querySelectorAll('.gh-nav-burger').forEach(function (burger) {
            burger.addEventListener('click', function () {
                document.querySelectorAll('.gh-mobilehead').forEach(function (mobilehead) {
                    mobilehead.classList.toggle('gh-mobilehead-open');
                });
            });
        });

        /** Toggle Details **/
        document.querySelectorAll('.toggle-details').forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                const expanded = toggle.parentElement.classList.toggle('expanded');
                const details = [];

                for (let sibling = toggle.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
                    if (sibling.classList.contains('details')) {
                        details.push(sibling);
                    }
                }

                setDisplay(details, expanded ? 'block' : 'none');
                setDisplay(toggle.querySelectorAll('.show'), expanded ? 'none' : 'inline');
                setDisplay(toggle.querySelectorAll('.hide'), expanded ? 'inline' : 'none');
            });
        });
    });
}());
