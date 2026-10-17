const ecoBadges = {

    "energy-saver": {
        name: "Energy Guardian",
        icon: "💡"
    },

    "water-warrior": {
        name: "Water Protector",
        icon: "💧"
    },

    "food-hero": {
        name: "Food Saver",
        icon: "🍽️"
    },

    "plastic-patrol": {
        name: "Plastic Defender",
        icon: "♻️"
    },

    "energy-guardian": {
        name: "Fuel Saver",
        icon: "🔥"
    },

    "green-journey": {
        name: "Green Traveler",
        icon: "🚗"
    },

    "sky-impact": {
        name: "Sky Protector",
        icon: "✈️"
    }

};


// =======================================
// BADGE STORAGE
// =======================================

const BADGE_STORAGE_KEY = "polarisBadges";


// =======================================
// CREATE DEFAULT BADGE STATE
// =======================================

function createDefaultBadgeState() {

    const badges = {};

    Object.keys(ecoBadges).forEach(badgeId => {

        badges[badgeId] = false;

    });

    return badges;
}


// =======================================
// GET SAVED BADGES
// =======================================

function getUnlockedBadges() {

    const defaultBadges =
        createDefaultBadgeState();

    const saved =
        localStorage.getItem(
            BADGE_STORAGE_KEY
        );

    if (!saved) {

        localStorage.setItem(
            BADGE_STORAGE_KEY,
            JSON.stringify(defaultBadges)
        );

        return defaultBadges;
    }

    try {

        const parsed =
            JSON.parse(saved);


        /*
         * Make sure every badge exists.
         * This also makes the system safe if
         * you add more badges later.
         */

        Object.keys(defaultBadges).forEach(
            badgeId => {

                if (
                    typeof parsed[badgeId] !==
                    "boolean"
                ) {

                    parsed[badgeId] = false;

                }

            }
        );


        localStorage.setItem(
            BADGE_STORAGE_KEY,
            JSON.stringify(parsed)
        );


        return parsed;

    }

    catch (error) {

        console.error(
            "Polaris badge storage error:",
            error
        );


        localStorage.setItem(
            BADGE_STORAGE_KEY,
            JSON.stringify(defaultBadges)
        );


        return defaultBadges;

    }

}


// =======================================
// SAVE BADGES
// =======================================

function saveBadges(badges) {

    localStorage.setItem(
        BADGE_STORAGE_KEY,
        JSON.stringify(badges)
    );

}


// =======================================
// COUNT EARNED BADGES
// =======================================

function getEarnedBadgeCount() {

    const badges =
        getUnlockedBadges();


    return Object.values(badges)
        .filter(value => value === true)
        .length;

}


// =======================================
// CHECK ALL 7 BADGES
// =======================================

function allBadgesUnlocked() {

    return (
        getEarnedBadgeCount() ===
        Object.keys(ecoBadges).length
    );

}


// =======================================
// UNLOCK BADGE
// =======================================

function unlockBadge(badgeId) {

    const badge =
        ecoBadges[badgeId];


    if (!badge) {

        console.error(
            "Unknown Polaris badge:",
            badgeId
        );

        return;

    }


    const badges =
        getUnlockedBadges();


    /*
     * If already unlocked, do nothing.
     * This prevents repeated unlocking.
     */

    if (badges[badgeId] === true) {

        return;

    }


    // Unlock badge

    badges[badgeId] = true;


    // SAVE PERMANENTLY IN THIS BROWSER

    saveBadges(badges);


    console.log(
        "🏆 Badge unlocked:",
        badge.name
    );


    // Update badge display

    updateBadgeDisplay();


    // If this was badge #7

    if (allBadgesUnlocked()) {

        unlockPolarisGuardian();

    }

}


// =======================================
// UPDATE BADGE DISPLAY
// =======================================

function updateBadgeDisplay() {

    const badges =
        getUnlockedBadges();


    document
        .querySelectorAll(".badge-card")
        .forEach(card => {


            const badgeId =
                card.dataset.badge;


            const status =
                card.querySelector(
                    ".badge-status"
                );


            if (
                badges[badgeId] === true
            ) {

                // =========================
                // UNLOCKED
                // =========================

                card.classList.remove(
                    "locked"
                );

                card.classList.add(
                    "unlocked"
                );


                if (status) {

                    status.textContent =
                        "🏅 Unlocked!";

                }

            }

            else {

                // =========================
                // LOCKED
                // =========================

                card.classList.remove(
                    "unlocked"
                );

                card.classList.add(
                    "locked"
                );


                if (status) {

                    status.textContent =
                        "🔒 Locked";

                }

            }

        });


    // ================================
    // BADGE COUNTER
    // ================================

    const earned =
        getEarnedBadgeCount();


    const total =
        Object.keys(ecoBadges).length;


    const earnedElement =
        document.getElementById(
            "badges-earned"
        );


    if (earnedElement) {

        earnedElement.textContent =
            earned;

    }


    // ================================
    // PROGRESS BAR
    // ================================

    const progressFill =
        document.getElementById(
            "badge-progress-fill"
        );


    if (progressFill) {

        const percentage =
            total === 0
                ? 0
                : (earned / total) * 100;


        progressFill.style.width =
            percentage + "%";

    }

}


// =======================================
// 🌍 POLARIS GUARDIAN
// =======================================

function unlockPolarisGuardian() {

    // Polaris Guardian requires all 7 Eco Badges.
    if (!allBadgesUnlocked()) {
        return;
    }


    const guardianAlreadyUnlocked =
        localStorage.getItem(
            "polarisGuardianUnlocked"
        );


    /*
     * If already unlocked, don't show
     * the completion celebration again.
     */

    if (
        guardianAlreadyUnlocked === "true"
    ) {

        unlockPolarisBeyond();

        return;

    }


    localStorage.setItem(
        "polarisGuardianUnlocked",
        "true"
    );


    /*
     * Beyond can only unlock after
     * all 7 Eco Badges are unlocked.
     */

    unlockPolarisBeyond();


    setTimeout(
        showPolarisCompletion,
        700
    );

}

// =======================================
// 🚀 POLARIS BEYOND
// =======================================

function unlockPolarisBeyond() {

    /*
     * IMPORTANT:
     * Polaris Beyond must NEVER unlock unless
     * all 7 original Eco Badges are unlocked.
     */

    if (!allBadgesUnlocked()) {

        localStorage.removeItem(
            "polarisBeyondUnlocked"
        );


        const beyond =
            document.getElementById(
                "polaris-beyond"
            );


        if (beyond) {

            beyond.classList.remove(
                "unlocked"
            );

            beyond.classList.add(
                "locked"
            );

        }


        return;

    }


    localStorage.setItem(
        "polarisBeyondUnlocked",
        "true"
    );


    const beyond =
        document.getElementById(
            "polaris-beyond"
        );


    if (beyond) {

        beyond.classList.remove(
            "locked"
        );

        beyond.classList.add(
            "unlocked"
        );

    }

}

// =======================================
// 🏆 ALL 7 BADGES COMPLETION
// =======================================

function showPolarisCompletion() {

    /*
     * Prevent duplicate modals.
     */

    const existing =
        document.getElementById(
            "polaris-completion-modal"
        );


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement("div");


    modal.id =
        "polaris-completion-modal";


    modal.innerHTML = `

        <div class="polaris-completion-overlay">

            <div class="polaris-completion-card">

                <div class="completion-earth">
                    🌍
                </div>

                <div class="completion-trophy">
                    🏆
                </div>

                <h1>
                    POLARIS GUARDIAN
                </h1>

                <h2>
                    You've unlocked all 7 badges!
                </h2>

                <p>
                    You've completed the Polaris
                    sustainability journey across
                    energy, water, food, plastic,
                    transport and travel.
                </p>

                <div class="completion-badges">

                    ${Object.values(ecoBadges)
                        .map(badge => `
                            <span
                                title="${badge.name}"
                            >
                                ${badge.icon}
                            </span>
                        `)
                        .join("")}

                </div>

                <div class="completion-message">

                    <strong>
                        Your journey doesn't stop here.
                    </strong>

                    <br><br>

                    You've mastered the basics.
                    Now it's time to go beyond.

                </div>

                <button
                    id="polaris-beyond-button"
                    class="polaris-beyond-button"
                >
                    🚀 Explore Polaris Beyond
                </button>

                <button
                    id="close-polaris-completion"
                    class="polaris-close-button"
                >
                    Continue Exploring
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    // ================================
    // SHOW ANIMATION
    // ================================

    setTimeout(() => {

        modal.classList.add("show");

    }, 50);


    // ================================
    // CLOSE BUTTON
    // ================================

    const closeButton =
        document.getElementById(
            "close-polaris-completion"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                modal.classList.remove(
                    "show"
                );


                setTimeout(() => {

                    modal.remove();

                }, 400);

            }
        );

    }


    // ================================
    // BEYOND BUTTON
    // ================================

    const beyondButton =
        document.getElementById(
            "polaris-beyond-button"
        );


    if (beyondButton) {

        beyondButton.addEventListener(
            "click",
            function () {

                modal.remove();


                const beyond =
                    document.getElementById(
                        "polaris-beyond"
                    );


                if (beyond) {

                    beyond.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }

}

// =======================================
// CHALLENGE TASKS
// =======================================

const challengeTasks = {

    "energy-saver": [

        "💡 Light Check: Find one light that is not needed right now and switch it off.",

        "🔌 Power Hunt: Find two devices that are not being used and safely switch them off.",

        "🌞 Daylight Challenge: Use natural daylight instead of turning on a light for at least 20 minutes.",

        "⚡ Sleep Mode: Find one device with a sleep or power-saving setting and turn it on.",

        "🏠 Energy Spotter: Find one habit in your home that wastes electricity and change it today.",

        "💡 Energy Win: Keep one electricity-saving habit going for the entire day.",

        "🏆 Energy Guardian: Do one final energy check around your home and switch off anything that does not need to be running."

    ],


    "water-warrior": [

        "💧 Tap Challenge: Turn off the tap while brushing your teeth.",

        "🚿 Shower Saver: Try to make your next shower a little shorter than usual.",

        "🔎 Leak Check: Look around your home for a dripping tap or visible water leak.",

        "💦 Water Spotter: Notice one time today when water is being used unnecessarily.",

        "🥤 Water Wise: When using water today, pause before turning on the tap and use only what you need.",

        "♻️ Reuse Hunt: Find one safe way to reuse water that would normally be thrown away.",

        "🏆 Water Protector: Find one water-saving habit from this week that you want to keep permanently."

    ],


    "food-hero": [

        "🍽️ Portion Challenge: Take a portion you are confident you can finish.",

        "🥡 Leftover Hunt: Find one leftover in your fridge that should be eaten soon.",

        "🔎 Food Check: Before your next food purchase, check if you already have something similar at home.",

        "📅 Use It First: Find one food that should be used soon and decide when you will eat it.",

        "📝 Meal Mission: Plan one meal using ingredients you already have.",

        "🍲 Leftover Rescue: Eat, store, or transform one leftover instead of throwing it away.",

        "🏆 Food Saver: Think about the food waste you avoided this week and choose one habit to continue."

    ],


    "plastic-patrol": [

        "💧 Bottle Mission: Use a reusable bottle today instead of a single-use plastic bottle.",

        "🛍️ Bag Challenge: Use a reusable bag the next time you carry or buy something.",

        "🥡 Reusable Container: Use a reusable container, lunchbox, or cup instead of a disposable one.",

        "🚫 Single-Use Swap: Find one single-use plastic item you normally use and replace it with a reusable option today.",

        "♻️ Better Choice: Find one everyday plastic item that could be replaced with a reusable alternative.",

        "🌎 Plastic Swap: Replace one disposable plastic item you normally use with a reusable option.",

        "🏆 Plastic Defender: Choose one plastic-saving habit from this week that you want to keep."

    ],


    "energy-guardian": [

    "🔥 Burner Match: When cooking, use a burner that is about the same size as the bottom of your pot or pan.",

    "🍳 Cover It: Cover a pot or pan during one meal when it is safe and practical.",

    "🔥 Flame Check: If you are cooking, check whether the flame is higher than necessary and adjust it safely.",

    "🍲 Cook Smart: When cooking, keep lids on pots when practical so food can heat efficiently.",

    "⏱️ Heat Check: Once food is properly heating, see whether you can safely lower the heat.",

    "🔥 Cooking Habit: Choose one cooking habit that could reduce unnecessary fuel use and try it today.",

    "🏆 Fuel Saver: Choose the cooking habit from this week that you want to make permanent."

],


    "green-journey": [

        "🚶 Short Trip: Replace one short car journey with walking or cycling if the route is safe.",

        "🚌 Transport Challenge: Use public transportation for one practical journey if available.",

        "🚗 Share the Ride: Share one journey with another person instead of making separate trips.",

        "📍 Combine Trips: Combine two errands into one journey instead of making separate trips.",

        "🚫 Skip a Trip: Identify one non-essential journey you can avoid today.",

        "🚲 Active Travel: Walk or cycle for one short journey if it is safe and practical.",

        "🏆 Green Traveler: Choose one transport habit from this week that you want to continue."

    ],


    "sky-impact": [

        "✈️ Flight Check: Think about one future flight and ask whether the journey is necessary.",

        "🚆 Alternative Hunt: Pick one future journey and see whether another form of transport could work.",

        "🗺️ Smarter Trip: Think of one way to combine activities during a future trip and avoid unnecessary travel.",

        "📅 Travel Check: Look at one upcoming journey and identify one way to reduce its environmental impact.",

        "🚆 Ground Option: Choose one future journey where ground transportation could realistically replace flying.",

        "✈️ Short-Flight Check: Think of one short flight you might take in the future and consider whether another option could work.",

        "🏆 Sky Protector: Choose two travel principles you want to remember when planning future journeys."

    ]

}

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =======================================
        // SHOW / HIDE TIPS
        // =======================================

        const toggleButtons =
            document.querySelectorAll(
                ".toggle-btn"
            );


        toggleButtons.forEach(button => {

            const tips =
                button.nextElementSibling;


            if (!tips) return;


            button.addEventListener(
                "click",
                function () {

                    tips.classList.toggle(
                        "visible"
                    );


                    button.textContent =
                        tips.classList.contains(
                            "visible"
                        )
                            ? "Hide Tips"
                            : "Show Tips";

                }
            );

        });


        // =======================================
        // DARK MODE
        // =======================================

        const darkModeBtn =
            document.createElement(
                "button"
            );


        darkModeBtn.textContent =
            "🌙 Dark Mode";


        Object.assign(
            darkModeBtn.style,
            {

                position: "fixed",

                bottom: "20px",

                right: "20px",

                padding: "12px 18px",

                background: "#2e7d32",

                color: "#ffffff",

                border: "none",

                borderRadius: "6px",

                fontWeight: "bold",

                cursor: "pointer",

                zIndex: "10000"

            }
        );


        document.body.appendChild(
            darkModeBtn
        );


        darkModeBtn.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );


                darkModeBtn.textContent =
                    document.body.classList.contains(
                        "dark-mode"
                    )
                        ? "☀️ Light Mode"
                        : "🌙 Dark Mode";

            }
        );


        // =======================================
        // SLIDERS
        // =======================================

        const sliders =
            document.querySelectorAll(
                ".eco-slider"
            );


        sliders.forEach(slider => {

            const value =
                slider.parentElement
                    ?.querySelector(
                        ".slider-value"
                    );


            if (!value) return;


            value.textContent =
                slider.value;


            slider.addEventListener(
                "input",
                function () {

                    value.textContent =
                        slider.value;

                }
            );

        });


        // =======================================
        // FOOTPRINT CALCULATOR
        // =======================================

        let carbonChart = null;


        const form =
            document.getElementById(
                "footprint-form"
            );


        if (form) {

            form.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();


                    const formData =
                        new FormData(form);


                    try {

                        const response =
                            await fetch(
                                "/calculate",
                                {
                                    method: "POST",
                                    body: formData
                                }
                            );


                        if (!response.ok) {

                            throw new Error(
                                "Server returned an error."
                            );

                        }


                        const data =
                            await response.json();


                        // ===================================
                        // HOUSEHOLD SCORE
                        // ===================================

                        const householdScore =
                            document.getElementById(
                                "household-score"
                            );


                        if (householdScore) {

                            householdScore.textContent =
                                data.household +
                                " kg CO₂e/year";

                        }


                        // ===================================
                        // PER PERSON SCORE
                        // ===================================

                        const personScore =
                            document.getElementById(
                                "person-score"
                            );


                        if (personScore) {

                            personScore.textContent =
                                data.per_person +
                                " kg CO₂e/year";

                        }


                        const yourFootprint =
                            document.getElementById(
                                "your-footprint"
                            );


                        if (yourFootprint) {

                            yourFootprint.textContent =
                                data.per_person +
                                " kg CO₂e/year";

                        }


                        // ===================================
                        // GLOBAL AVERAGE
                        // ===================================

                        const globalFootprint =
                            document.getElementById(
                                "global-footprint"
                            );


                        if (globalFootprint) {

                            globalFootprint.textContent =
                                data.global_average +
                                " kg CO₂e/person/year";

                        }


                        // ===================================
                        // GLOBAL COMPARISON
                        // ===================================

                        const comparisonScore =
                            document.getElementById(
                                "comparison-score"
                            );


                        if (comparisonScore) {

                            comparisonScore.textContent =
                                data.global_percentage +
                                "% of global average";

                        }


                        const polarisInsight =
                            document.getElementById(
                                "polaris-insight"
                            );


                        if (polarisInsight) {

                            polarisInsight.textContent =
                                data.comparison_message;

                        }


                        // ===================================
                        // LARGEST SOURCE
                        // ===================================

                        const largestSource =
                            document.getElementById(
                                "largest-source"
                            );


                        if (largestSource) {

                            largestSource.textContent =
                                data.largest;

                        }


                        // ===================================
                        // RECOMMENDATION
                        // ===================================

                        const recommendation =
                            document.getElementById(
                                "recommendation"
                            );


                        
                           if (recommendation) {

                                recommendation.innerHTML =
                                        data.recommendation || "";

                                    }

                                    // ===================================
// INPUT WARNINGS
// ===================================

const inputWarnings =
    document.getElementById(
        "inputWarnings"
    );


if (inputWarnings) {

    inputWarnings.innerHTML = "";


    if (
        Array.isArray(data.input_warnings) &&
        data.input_warnings.length > 0
    ) {

        data.input_warnings.forEach(
            warning => {

                const warningElement =
                    document.createElement(
                        "div"
                    );


                warningElement.className =
                    "input-warning";


                warningElement.textContent =
                    warning;


                inputWarnings.appendChild(
                    warningElement
                );

            }
        );

    }

}
                        // ===================================
                        // GRAPH DATA
                        // ===================================

                        const graphData = {

                            "Electricity":
                                Number(
                                    data.electricity
                                ) || 0,

                            "Water":
                                Number(
                                    data.water
                                ) || 0,

                            "Food Waste":
                                Number(
                                    data.food
                                ) || 0,

                            "Plastic":
                                Number(
                                    data.plastic
                                ) || 0,

                            "Transport":
                                Number(
                                    data.transport
                                ) || 0,

                            "Gas":
                                Number(
                                    data.gas
                                ) || 0,

                            "Flights":
                                Number(
                                    data.flights
                                ) || 0

                        };


                        // ===================================
                        // REMOVE ZERO VALUES
                        // ===================================

                        const filteredData =
                            Object.fromEntries(

                                Object.entries(
                                    graphData
                                ).filter(
                                    ([key, value]) =>
                                        value > 0
                                )

                            );


                        // ===================================
                        // CREATE / UPDATE GRAPH
                        // ===================================

                        const ctx =
                            document.getElementById(
                                "carbonChart"
                            );


                        if (
                            ctx &&
                            typeof Chart !==
                            "undefined"
                        ) {


                            if (carbonChart) {

                                carbonChart.destroy();

                            }


                            carbonChart =
                                new Chart(
                                    ctx,
                                    {

                                        type: "bar",

                                        data: {

                                            labels:
                                                Object.keys(
                                                    filteredData
                                                ),

                                            datasets: [

                                                {

                                                    label:
                                                        "Estimated annual CO₂e by category (kg CO₂e/year)",

                                                    data:
                                                        Object.values(
                                                            filteredData
                                                        ),

                                                    backgroundColor:
                                                        "#4CAF50"

                                                }

                                            ]

                                        },


                                        options: {

                                            responsive: true,

                                            scales: {

                                                y: {

                                                    beginAtZero:
                                                        true,

                                                    title: {

                                                        display:
                                                            true,

                                                        text:
                                                            "Estimated CO₂e (kg/year)"

                                                    }

                                                }

                                            }

                                        }

                                    }
                                );

                        }


                        // ===================================
                        // SCROLL TO DASHBOARD
                        // ===================================

                        const dashboard =
                            document.getElementById(
                                "dashboard"
                            );


                        if (dashboard) {

                            dashboard.scrollIntoView({

                                behavior: "smooth"

                            });

                        }

                    }


                    catch (error) {

                        console.error(
                            "Polaris calculator error:",
                            error
                        );


                        alert(
                            "Something went wrong calculating your footprint. Please try again."
                        );

                    }

                }
            );

        }


        // =======================================
        // INITIALIZE BADGES
        // =======================================

        /*
         * IMPORTANT:
         *
         * This only READS the saved badge state.
         *
         * It DOES NOT reset badges.
         */

        getUnlockedBadges();

        updateBadgeDisplay();


        // =======================================
        // GET CHALLENGE ID
        // =======================================

        const pathParts =
            window.location.pathname
                .split("/")
                .filter(Boolean);


        let challengeId = null;


        if (
            pathParts.length >= 2 &&
            pathParts[0] === "challenge"
        ) {

            challengeId =
                pathParts[
                    pathParts.length - 1
                ];

        }


        // =======================================
        // START CHALLENGE SYSTEM
        // =======================================

        if (
            challengeId &&
            challengeTasks[challengeId]
        ) {

            setupChallenge(
                challengeId
            );

        }


    });


// =======================================
// CHALLENGE SYSTEM
// =======================================

function setupChallenge(id) {


    const startButton =
        document.getElementById(
            "start-challenge-btn"
        );


    const completeButton =
        document.getElementById(
            "complete-day-btn"
        );


    const todayAction =
        document.getElementById(
            "today-action"
        );


    const trackerStatus =
        document.getElementById(
            "tracker-status"
        );


    const badgeBox =
        document.getElementById(
            "badge-earned"
        );


    const badgeName =
        document.getElementById(
            "earned-badge-name"
        );


    if (
        !startButton ||
        !completeButton
    ) {

        return;

    }


    // ===================================
    // STORAGE
    // ===================================

    const storageKey =
        "polarisChallenge_" + id;


    let progress;


    try {

        progress =
            JSON.parse(
                localStorage.getItem(
                    storageKey
                )
            );

    }

    catch {

        progress = null;

    }


    if (
        !progress ||
        typeof progress !== "object"
    ) {

        progress = {

            started: false,

            startDate: null,

            completedDays: [],

            lastCompletedDate: null

        };

    }


    if (
        !Array.isArray(
            progress.completedDays
        )
    ) {

        progress.completedDays = [];

    }


    // ===================================
    // GET LOCAL DATE
    // ===================================

    function getToday() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                now.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    // ===================================
    // SAVE PROGRESS
    // ===================================

    function saveProgress() {

        localStorage.setItem(

            storageKey,

            JSON.stringify(
                progress
            )

        );

    }


    // ===================================
    // GET NEXT DAY
    // ===================================

    function getNextDay() {

        return (
            progress.completedDays.length +
            1
        );

    }


    // ===================================
    // SHOW CURRENT TASK
    // ===================================

    function showCurrentTask() {

        if (!todayAction) {

            return;

        }


        // ================================
        // NOT STARTED
        // ================================

        if (!progress.started) {

            todayAction.textContent =
                "Start the challenge to reveal your first action. 🌱";

            return;

        }


        // ================================
        // COMPLETE
        // ================================

        if (
            progress.completedDays.length >= 7
        ) {

            todayAction.textContent =
                "🎉 You completed all 7 challenge days!";

            return;

        }


        // ================================
        // CURRENT DAY
        // ================================

        const nextDay =
            getNextDay();


        const task =
            challengeTasks[id][
                nextDay - 1
            ];


        if (task) {

            todayAction.textContent =
                task;

        }

    }


    // ===================================
    // UPDATE DAY BOXES
    // ===================================

    function updateDayBoxes() {

        const completed =
            progress.completedDays.length;


        document
            .querySelectorAll(".day-box")
            .forEach(box => {


                const day =
                    Number(
                        box.dataset.day
                    );


                const status =
                    box.querySelector(
                        ".day-status"
                    );


                box.classList.remove(
                    "active",
                    "completed"
                );


                // =========================
                // COMPLETED
                // =========================

                if (
                    progress.completedDays
                        .includes(day)
                ) {

                    box.classList.add(
                        "completed"
                    );


                    if (status) {

                        status.textContent =
                            "✅";

                    }

                }


                // =========================
                // NEXT AVAILABLE DAY
                // =========================

                else if (
                    progress.started &&
                    day === completed + 1 &&
                    completed < 7
                ) {

                    box.classList.add(
                        "active"
                    );


                    if (status) {

                        status.textContent =
                            "▶️";

                    }

                }


                // =========================
                // LOCKED
                // =========================

                else {

                    if (status) {

                        status.textContent =
                            "🔒";

                    }

                }

            });

    }


    // ===================================
    // UPDATE CHALLENGE UI
    // ===================================

    function updateUI() {

        const completed =
            progress.completedDays.length;


        updateDayBoxes();

        showCurrentTask();


        // ===================================
        // NOT STARTED
        // ===================================

        if (!progress.started) {

            startButton.disabled =
                false;


            startButton.textContent =
                "🚀 Start Challenge";


            completeButton.disabled =
                true;


            completeButton.textContent =
                "Mark Today's Action Complete";


            if (trackerStatus) {

                trackerStatus.textContent =
                    "Start the challenge to begin your 7-day journey. 🌱";

            }


            return;

        }


        // ===================================
        // CHALLENGE COMPLETE
        // ===================================

        if (completed >= 7) {

            startButton.disabled =
                true;


            startButton.textContent =
                "🏅 Challenge Complete";


            completeButton.disabled =
                true;


            completeButton.textContent =
                "🏅 Challenge Complete";


            if (trackerStatus) {

                trackerStatus.textContent =
                    "🎉 You completed all 7 days!";

            }


            showBadge();

            return;

        }


        // ===================================
        // CHALLENGE STARTED
        // ===================================

        startButton.disabled =
            true;


        startButton.textContent =
            "✅ Challenge Started";


        const today =
            getToday();


        // ===================================
        // TODAY ALREADY COMPLETE
        // ===================================

        if (
            progress.lastCompletedDate ===
            today
        ) {

            completeButton.disabled =
                true;


            completeButton.textContent =
                "✅ Today's Action Complete";


            if (trackerStatus) {

                trackerStatus.textContent =
                    "Today's action is complete. Come back tomorrow for your next action. 🌱";

            }

        }


        // ===================================
        // READY FOR TODAY
        // ===================================

        else {

            completeButton.disabled =
                false;


            completeButton.textContent =
                "Mark Today's Action Complete";


            if (trackerStatus) {

                trackerStatus.textContent =
                    "Day " +
                    (completed + 1) +
                    " of 7 — Complete today's action! 🌱";

            }

        }

    }


    // ===================================
    // START CHALLENGE
    // ===================================

    startButton.addEventListener(
        "click",
        function () {


            /*
             * Prevent restarting an existing
             * challenge and wiping progress.
             */

            if (progress.started) {

                return;

            }


            progress.started =
                true;


            progress.startDate =
                getToday();


            progress.completedDays =
                [];


            progress.lastCompletedDate =
                null;


            saveProgress();


            updateUI();

        }
    );


    // ===================================
    // COMPLETE TODAY'S ACTION
    // ===================================

    completeButton.addEventListener(
        "click",
        function () {


            // ================================
            // MUST BE STARTED
            // ================================

            if (!progress.started) {

                return;

            }


            // ================================
            // NEVER EXCEED 7 DAYS
            // ================================

            if (
                progress.completedDays.length >= 7
            ) {

                return;

            }


            const today =
                getToday();


            // ================================
            // SAME-DAY PROTECTION
            // ================================

            if (
                progress.lastCompletedDate ===
                today
            ) {

                alert(
                    "🌱 You've already completed today's action!\n\n" +
                    "Come back tomorrow for your next action."
                );


                return;

            }


            // ================================
            // DETERMINE NEXT DAY
            // ================================

            const nextDay =
                progress.completedDays.length +
                1;


            if (
                nextDay < 1 ||
                nextDay > 7
            ) {

                return;

            }


            // ================================
            // RECORD COMPLETION
            // ================================

            progress.completedDays.push(
                nextDay
            );


            progress.lastCompletedDate =
                today;


            saveProgress();


            // ================================
            // DAY 7 = BADGE UNLOCK
            // ================================

            if (
                progress.completedDays.length ===
                7
            ) {

                unlockBadge(id);

            }


            /*
             * Refresh page.
             *
             * The badge/progress data has already
             * been saved BEFORE the refresh.
             */

            window.location.reload();

        }
    );


    // ===================================
    // SHOW EARNED BADGE
    // ===================================

    function showBadge() {

        const badge =
            ecoBadges[id];


        if (
            !badge ||
            !badgeBox ||
            !badgeName
        ) {

            return;

        }


        badgeBox.classList.remove(
            "hidden"
        );


        badgeName.textContent =
            badge.icon +
            " " +
            badge.name;

    }


    // ===================================
    // INITIALIZE CHALLENGE
    // ===================================

    updateUI();

}


// =======================================
// RECOMMENDATION SYSTEM
// =======================================

function createRecommendation(data) {


    const recommendations = {


        "Electricity":

            "💡 Electricity is your biggest source of estimated emissions. Try switching off unused lights and electronics, using natural light, and reducing unnecessary standby power.",


        "Water":

            "💧 Water use is your biggest source of estimated emissions. Try taking shorter showers, turning off taps when they are not needed, and fixing leaks.",


        "Food Waste":

            "🍽️ Food waste is your biggest source of estimated emissions. Plan meals, store leftovers properly, and take only the amount of food you expect to finish.",


        "Plastic":

            "♻️ Plastic waste is your biggest source of estimated emissions. Try reusable bottles and bags, reusable containers, and avoiding unnecessary single-use plastics.",


        "Transport":

            "🚗 Transport is your biggest source of estimated emissions. Walk, cycle, use public transport, combine errands, or share rides when practical.",


        "Gas":

            "🔥 Cooking fuel is your biggest source of estimated emissions. Use the correct flame size, cover pots when appropriate, and avoid unnecessary fuel use.",


        "Flights":

            "✈️ Flights are your biggest source of estimated emissions. Consider lower-emission alternatives to flying when practical and combine trips where possible."

    };


    return (

        recommendations[data.largest] ||

        "🌱 Keep making sustainable choices! Focus on the category with the largest estimated impact."

    );

}

// ============================================================
// 🚀 POLARIS BEYOND
// ============================================================
//
// ADDITIVE SYSTEM
//
// This section does NOT replace:
// - Original 7 challenges
// - Original 7 badges
// - Calculator
// - Chart
// - Dark mode
// - Recommendations
// - Original challenge progress
//
// Polaris Beyond uses its own:
// - localStorage key
// - challenges
// - badges
// - progress
// - XP
// - completion milestone
//
// ============================================================


// ========================================================
// STORAGE
// ========================================================

const POLARIS_BEYOND_STORAGE_KEY =
    "polarisBeyondState";

const POLARIS_BEYOND_UNLOCK_KEY =
    "polarisBeyondUnlocked";

// ========================================================
// BEYOND CHALLENGES
// ========================================================

const polarisBeyondChallenges = {

    "climate-detective": {

        name: "Climate Detective",

        icon: "🔎",

        badge: "Climate Detective",

        badgeIcon: "🔎",

        description:
            "Track down hidden sources of environmental impact and become better at spotting them in everyday life.",

        tasks: [ 
        "🔎 Discover: Find one everyday activity in your home that creates environmental impact through energy, water, materials, food, or transport.",

         "📊 Measure: Find one simple number, estimate, label, bill, or observation that helps you understand how much of that activity happens.", 

         "🌍 Change: Make one realistic change that reduces the environmental impact of that activity today.", 

         "💡 Improve: Think of a better or more efficient way to reduce the same impact and try it if practical.", 

         "🤝 Influence: Show someone else the change you made and encourage them to try it too.",

         "♻️ Sustain: Find a way to make your new habit easier to repeat in everyday life.", 

         "🏆 Impact: Look back at the change you made and identify what environmental impact you reduced and what you will continue doing." 
        ]

    },


    "home-optimizer": {

        name: "Home Optimizer",

        icon: "🏠",

        badge: "Home Optimizer",

        badgeIcon: "🏠",

        description:
            "Find simple ways to make your home more efficient without making everyday life harder.",

        tasks: [ 
            "🏠 Discover: Find one place in your home where electricity or water could be used more efficiently.", 

            "📊 Measure: Observe how often that resource is being used unnecessarily during one part of the day.",

            "💡 Change: Make one practical change that reduces unnecessary electricity or water use.", 

            "⚡ Improve: Find another way to make the same activity more efficient without making it harder.", 

            "🤝 Influence: Show someone in your household the change and encourage them to help maintain it.", 

            "🔄 Sustain: Set up one simple reminder, routine, or habit that can keep the change going.", 

            "🏆 Impact: Compare your home before and after the change and identify what resource you think you saved." 
        ]

    },


    "food-footprint": {

        name: "Food Footprint",

        icon: "🍽️",

        badge: "Food Footprint",

        badgeIcon: "🍽️",

        description:
            "Discover how everyday food choices connect to waste, resources, and the environment.",

        tasks: [ 
            "🍽️ Discover: Find one food in your home that could be wasted if it is not used soon",

            "📊 Measure: Notice how much food your household throws away during one meal or part of one day.",

             "🥡 Change: Use, store, freeze, or transform one food item that might otherwise be wasted.", 

             "🍲 Improve: Find a better way to plan, store, or serve food so less of it is wasted.", 
             "🤝 Influence: Encourage someone in your household to help rescue or reduce one piece of food waste.", 
             
             "📅 Sustain: Choose one food-saving habit and use it again during the next week.", 
             
             "🏆 Impact: Look back at the food you saved and identify one change that could prevent future waste." ]

    },


    "conscious-consumer": {

        name: "Conscious Consumer",

        icon: "🛍️",

        badge: "Conscious Consumer",

        badgeIcon: "🛍️",

        description:
            "Learn how small purchasing decisions can reduce waste and encourage more sustainable choices.",

        tasks: [ 
            "🛍️ Discover: Find one product you regularly buy that creates unnecessary waste through packaging, materials, or short-term use.", 

            "📊 Measure: Compare the amount of packaging or disposable material used by two similar products.", 

            "♻️ Change: Choose a reusable, refillable, repairable, or lower-waste option for one everyday need.", 

            "💡 Improve: Find another way to make your use of that product less wasteful.", 
            
            "🤝 Influence: Show someone else the alternative you found and explain why you chose it.", 
            
            "🔄 Sustain: Choose one purchasing rule you can realistically follow in the future.",
            
            "🏆 Impact: Identify one type of waste your new purchasing habit could prevent over time." ]
    },


    "nature-defender": {

        name: "Nature Defender",

        icon: "🌱",

        badge: "Nature Defender",

        badgeIcon: "🌱",

        description:
            "Look closer at the living world around you and discover simple ways to protect it.",

        tasks: [ 
            "🌱 Discover: Find one plant, animal, habitat, or green space near you that could benefit from protection.", 

            "📊 Measure: Count or record one simple sign of the condition of that space, such as litter, damaged plants, or the number of different species you observe.",

            "🚯 Change: Take one safe action that directly helps the area, such as removing litter or protecting a small habitat.", 

            "🌿 Improve: Find another practical way to make the space more welcoming or safer for local wildlife.", 

            "🤝 Influence: Encourage another person to help with one small action that protects the area.", 

            "🌳 Sustain: Choose one action you can repeat regularly to help maintain the space.",

            "🏆 Impact: Look at what changed because of your actions and identify one way you can continue protecting local nature." 

        ]

    },


    "community-catalyst": {

        name: "Community Catalyst",

        icon: "🤝",

        badge: "Community Catalyst",

        badgeIcon: "🤝",

        description:
            "Turn one sustainability idea into a conversation, action, or small change involving other people.",

        tasks: [ 
            "🤝 Discover: Find one sustainability problem at your home, school, or neighbourhood that you would genuinely like to improve.", 

            "📊 Measure: Record one simple observation or example that shows how often the problem happens.", 

            "💡 Change: Take one small action that directly addresses the problem.", 

            "🚀 Improve: Think of a better way to solve the problem and try it on a small scale",

            "🗣️ Influence: Get at least one other person to join you in the action.", 

            "🔄 Sustain: Find a way for the action to continue even after your challenge ends.",
            
            "🏆 Impact: Explain what changed because of your action and what you would like your community to do next." 
        ]

    },


    "impact-leader": {

        name: "Impact Leader",

        icon: "🚀",

        badge: "Polaris Impact Leader",

        badgeIcon: "🚀",

        description:
            "Bring your Polaris journey together by turning one environmental idea into a real-world action.",

        tasks: [ 
            
            "🚀 Discover: Choose one environmental problem you genuinely care about and identify where you can make a difference.", 

            "📊 Measure: Record one simple observation, number, or example that describes the situation before you act.",

            "💡 Change: Design and carry out one realistic action that could improve the situation.", 

            "🧪 Improve: Adjust your idea based on what happened and test the improved version if practical and safe.", 

            "🤝 Influence: Involve another person in your project or encourage them to adopt part of your solution.", 

            "🔄 Sustain: Create a simple plan for keeping your solution going beyond the seven-day challenge.", 

            "🏆 Impact: Summarize your problem, starting point, action, results, and next step — your first mini sustainability project." ]

    }

};


// ========================================================
// BEYOND BADGES
// ========================================================

const polarisBeyondBadges = {

    "climate-detective": {

        name: "Climate Detective",

        icon: "🔎"

    },

    "home-optimizer": {

        name: "Home Optimizer",

        icon: "🏠"

    },

    "food-footprint": {

        name: "Food Footprint",

        icon: "🍽️"

    },

    "conscious-consumer": {

        name: "Conscious Consumer",

        icon: "🛍️"

    },

    "nature-defender": {

        name: "Nature Defender",

        icon: "🌱"

    },

    "community-catalyst": {

        name: "Community Catalyst",

        icon: "🤝"

    },

    "impact-leader": {

        name: "Polaris Impact Leader",

        icon: "🚀"

    }

};

// ========================================================
// XP SYSTEM
// ========================================================

const POLARIS_BEYOND_XP_PER_DAY = 20;

const POLARIS_BEYOND_XP_PER_BADGE = 50;

const POLARIS_BEYOND_FINAL_XP = 200;


const polarisBeyondLevels = [

    {

        level: 1,

        name: "Beyond Explorer",

        xp: 0

    },

    {

        level: 2,

        name: "Impact Investigator",

        xp: 100

    },

    {

        level: 3,

        name: "Sustainability Analyst",

        xp: 250

    },

    {

        level: 4,

        name: "Polaris Researcher",

        xp: 450

    },

    {

        level: 5,

        name: "Polaris Impact Leader",

        xp: 700

    }

];


// ========================================================
// DEFAULT STATE
// ========================================================

function createPolarisBeyondDefaultState() {

    const challenges = {};


    Object.keys(
        polarisBeyondChallenges
    ).forEach(id => {

        challenges[id] = {

            started: false,

            startDate: null,

            completedDays: [],

            lastCompletedDate: null

        };

    });


    const badges = {};


    Object.keys(
        polarisBeyondBadges
    ).forEach(id => {

        badges[id] = false;

    });


    return {

        xp: 0,

        challenges: challenges,

        badges: badges,

        impactLeaderUnlocked: false

    };

}


// ========================================================
// LOAD STATE
// ========================================================

function getPolarisBeyondState() {

    const defaults =
        createPolarisBeyondDefaultState();


    const saved =
        localStorage.getItem(
            POLARIS_BEYOND_STORAGE_KEY
        );


    if (!saved) {

        localStorage.setItem(

            POLARIS_BEYOND_STORAGE_KEY,

            JSON.stringify(defaults)

        );


        return defaults;

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (
            typeof parsed !== "object" ||
            parsed === null
        ) {

            throw new Error(
                "Invalid Beyond state"
            );

        }


        if (
            typeof parsed.xp !== "number"
        ) {

            parsed.xp = 0;

        }


        if (
            typeof parsed.challenges !== "object" ||
            parsed.challenges === null
        ) {

            parsed.challenges =
                defaults.challenges;

        }


        if (
            typeof parsed.badges !== "object" ||
            parsed.badges === null
        ) {

            parsed.badges =
                defaults.badges;

        }


        Object.keys(
            polarisBeyondChallenges
        ).forEach(id => {

            if (
                !parsed.challenges[id] ||
                typeof parsed.challenges[id] !== "object"
            ) {

                parsed.challenges[id] =
                    defaults.challenges[id];

            }


            if (
                !Array.isArray(
                    parsed.challenges[id].completedDays
                )
            ) {

                parsed.challenges[id].completedDays =
                    [];

            }

        });


        Object.keys(
            polarisBeyondBadges
        ).forEach(id => {

            if (
                typeof parsed.badges[id] !== "boolean"
            ) {

                parsed.badges[id] = false;

            }

        });


        if (
            typeof parsed.impactLeaderUnlocked !==
            "boolean"
        ) {

            parsed.impactLeaderUnlocked =
                false;

        }


        savePolarisBeyondState(
            parsed
        );


        return parsed;

    }

    catch (error) {

        console.error(
            "Polaris Beyond storage error:",
            error
        );


        savePolarisBeyondState(
            defaults
        );


        return defaults;

    }

}


// ========================================================
// SAVE STATE
// ========================================================

function savePolarisBeyondState(state) {

    localStorage.setItem(

        POLARIS_BEYOND_STORAGE_KEY,

        JSON.stringify(state)

    );

}


// ========================================================
// DATE
// ========================================================

function getPolarisBeyondToday() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ========================================================
// XP
// ========================================================

function getPolarisBeyondLevel(xp) {

    let currentLevel =
        polarisBeyondLevels[0];

    polarisBeyondLevels.forEach(
        level => {

            if (
                xp >= level.xp
            ) {

                currentLevel =
                    level;

            }

        }
    );

    return currentLevel;

}


function getNextPolarisBeyondLevel(xp) {

    return (
        polarisBeyondLevels.find(
            level => xp < level.xp
        ) || null
    );

}


function awardPolarisBeyondXP(amount) {

    const state =
        getPolarisBeyondState();

    state.xp += amount;

    savePolarisBeyondState(
        state
    );

    renderPolarisBeyond();

}


// ========================================================
// BADGE COUNT
// ========================================================

function getPolarisBeyondBadgeCount() {

    const state =
        getPolarisBeyondState();

    return Object.values(
        state.badges
    ).filter(
        value => value === true
    ).length;

}


// ========================================================
// TOTAL COMPLETED DAYS
// ========================================================

function getPolarisBeyondCompletedDays() {

    const state =
        getPolarisBeyondState();

    return Object.values(
        state.challenges
    ).reduce(
        (total, challenge) =>
            total +
            challenge.completedDays.length,
        0
    );

}


// ========================================================
// CHECK FINAL COMPLETION
// ========================================================

function checkPolarisBeyondCompletion() {

    const state =
        getPolarisBeyondState();

    const allComplete =
        Object.values(
            state.badges
        ).every(
            badge => badge === true
        );

    if (
        allComplete &&
        !state.impactLeaderUnlocked
    ) {

        state.impactLeaderUnlocked =
            true;

        state.xp +=
            POLARIS_BEYOND_FINAL_XP;

        savePolarisBeyondState(
            state
        );

        showPolarisImpactLeader();

    }

}


// ========================================================
// COMPLETE BEYOND DAY
// ========================================================

function completePolarisBeyondDay(id) {

    const state =
        getPolarisBeyondState();

    const challenge =
        state.challenges[id];

    if (!challenge) {
        return;
    }

    if (!challenge.started) {
        return;
    }

    if (
        challenge.completedDays.length >= 7
    ) {
        return;
    }

    const today =
        getPolarisBeyondToday();


    // --------------------------------
    // SAME-DAY PROTECTION
    // --------------------------------

    if (
        challenge.lastCompletedDate ===
        today
    ) {

        alert(
            "🌱 You've already completed today's Beyond action.\n\nCome back tomorrow for the next action."
        );

        return;

    }


    const nextDay =
        challenge.completedDays.length + 1;

    if (
        nextDay < 1 ||
        nextDay > 7
    ) {
        return;
    }


    challenge.completedDays.push(
        nextDay
    );

    challenge.lastCompletedDate =
        today;


    state.xp +=
        POLARIS_BEYOND_XP_PER_DAY;


    // --------------------------------
    // DAY 7 = BEYOND BADGE
    // --------------------------------

    if (
        challenge.completedDays.length === 7
    ) {

        if (
            state.badges[id] !== true
        ) {

            state.badges[id] = true;

            state.xp +=
                POLARIS_BEYOND_XP_PER_BADGE;

        }

    }


    savePolarisBeyondState(
        state
    );


    checkPolarisBeyondCompletion();


    window.location.reload();

}


// ========================================================
// START BEYOND CHALLENGE
// ========================================================

    function startPolarisBeyondChallenge(id) {

        const state =
            getPolarisBeyondState();


        const challenge =
            state.challenges[id];


        if (!challenge) {

            return;

        }


        if (challenge.started) {

            return;

        }


        challenge.started =
            true;


        challenge.startDate =
            getPolarisBeyondToday();


        challenge.completedDays =
            [];


        challenge.lastCompletedDate =
            null;


        savePolarisBeyondState(
            state
        );


        renderPolarisBeyond();

    }


    // ========================================================
    // GENERATE CHALLENGE CARD
    // ========================================================

    function createPolarisBeyondChallengeCard(
        id,
        challenge,
        state
    ) {

        const progress =
            state.challenges[id];


        const completed =
            progress.completedDays.length;


        const today =
            getPolarisBeyondToday();


        const todayComplete =
            progress.lastCompletedDate ===
            today;


        const finished =
            completed >= 7;


        let nextDay =
            completed + 1;


        if (nextDay > 7) {

            nextDay = 7;

        }


        const currentTask =
            challenge.tasks[
                nextDay - 1
            ];


        const progressPercent =
            (completed / 7) * 100;


        const card =
            document.createElement("div");


        card.className =
            "polaris-beyond-challenge-card";


        card.dataset.challenge =
            id;


        let actionHTML;


        if (!progress.started) {

            actionHTML = `

                <p class="polaris-beyond-task">

                    Start this mission to reveal
                    your first Beyond action. 🌱

                </p>

                <button
                    class="polaris-beyond-action-button"
                    data-beyond-start="${id}"
                >
                    🚀 Start Mission
                </button>

            `;

        }

        else if (finished) {

            actionHTML = `

                <p class="polaris-beyond-task">

                    🎉 All 7 days completed!

                </p>

                <div class="polaris-beyond-complete-label">

                    🏅 Beyond Badge Earned

                </div>

            `;

        }

        else {

            actionHTML = `

                <p class="polaris-beyond-day-label">

                    DAY ${nextDay} OF 7

                </p>

                <p class="polaris-beyond-task">

                    ${currentTask}

                </p>

                <button
                    class="polaris-beyond-action-button"
                    data-beyond-complete="${id}"
                    ${todayComplete ? "disabled" : ""}
                >

                    ${
                        todayComplete
                            ? "✅ Today's Action Complete"
                            : "Mark Today's Action Complete"
                    }

                </button>

            `;

        }


        let dayBoxes = "";


        for (
            let day = 1;
            day <= 7;
            day++
        ) {

            const isCompleted =
                progress.completedDays.includes(
                    day
                );


            const isActive =
                progress.started &&
                day === nextDay &&
                !finished;


            dayBoxes += `

                <span
                    class="
                        polaris-beyond-day-box
                        ${isCompleted ? "completed" : ""}
                        ${isActive ? "active" : ""}
                    "
                >

                    ${
                        isCompleted
                            ? "✅"
                            : isActive
                                ? "▶️"
                                : "🔒"
                    }

                </span>

            `;

        }


        card.innerHTML = `

            <div class="polaris-beyond-card-header">

                <div class="polaris-beyond-card-icon">

                    ${challenge.icon}

                </div>

                <div>

                    <h3>

                        ${challenge.name}

                    </h3>

                    <p>

                        ${challenge.description}

                    </p>

                </div>

            </div>


            <div class="polaris-beyond-card-progress">

                <div class="polaris-beyond-progress-top">

                    <span>

                        Progress

                    </span>

                    <strong>

                        ${completed}/7

                    </strong>

                </div>


                <div class="polaris-beyond-mini-progress">

                    <div
                        style="width:${progressPercent}%"
                    ></div>

                </div>

            </div>


            <div class="polaris-beyond-days">

                ${dayBoxes}

            </div>


            <div class="polaris-beyond-action">

                ${actionHTML}

            </div>


            <div class="polaris-beyond-earned-badge">

                <span>

                    ${challenge.badgeIcon}

                </span>

                <span>

                    Badge:
                    <strong>
                        ${challenge.badge}
                    </strong>

                </span>

                ${
                    state.badges[id]
                        ? `<span class="polaris-beyond-badge-earned">
                            🏅 Earned
                           </span>`
                        : `<span>
                            🔒 Locked
                           </span>`
                }

            </div>

        `;


        return card;

    }


    // ========================================================
    // RENDER DASHBOARD
    // ========================================================

    function renderPolarisBeyond() {

        const section =
            document.getElementById(
                "polaris-beyond"
            );


        if (!section) {

            return;

        }


        const unlocked =
    localStorage.getItem(
        POLARIS_BEYOND_UNLOCK_KEY
    ) === "true";

const ecoBadgesComplete =
    allBadgesUnlocked();

        section.classList.remove(
            "locked"
        );

        section.classList.add(
            "unlocked"
        );


        const state =
            getPolarisBeyondState();


        let app =
            document.getElementById(
                "polaris-beyond-app"
            );


        // --------------------------------
        // AUTOMATIC HTML GENERATION
        // --------------------------------

        if (!app) {

            app =
                document.createElement("div");

            app.id =
                "polaris-beyond-app";


            section.appendChild(
                app
            );

        }


        const level =
            getPolarisBeyondLevel(
                state.xp
            );


        const nextLevel =
            getNextPolarisBeyondLevel(
                state.xp
            );


        const badgeCount =
            getPolarisBeyondBadgeCount();


        const completedDays =
            getPolarisBeyondCompletedDays();


        const totalDays =
            49;


        let levelPercent;


        if (!nextLevel) {

            levelPercent = 100;

        }

        else {

            const previousLevel =
                level;


            const range =
                nextLevel.xp -
                previousLevel.xp;


            const progress =
                state.xp -
                previousLevel.xp;


            levelPercent =
                Math.min(
                    100,
                    Math.max(
                        0,
                        (progress / range) * 100
                    )
                );

        }


        app.innerHTML = `

            <div class="polaris-beyond-dashboard">


                <div class="polaris-beyond-title">

                    <span class="polaris-beyond-rocket">

                        🚀

                    </span>

                    <div>

                        <h2>

                            Polaris Beyond

                        </h2>

                        <p>

                            You've mastered the basics.
                            Now investigate, measure,
                            experiment, and create impact.

                        </p>

                    </div>

                </div>


                <!-- ===================================== -->
                <!-- STATS -->
                <!-- ===================================== -->

                <div class="polaris-beyond-stats">


                    <div class="polaris-beyond-stat">

                        <span>⭐</span>

                        <strong>
                            ${state.xp}
                        </strong>

                        <small>
                            XP
                        </small>

                    </div>


                    <div class="polaris-beyond-stat">

                        <span>🌟</span>

                        <strong>
                            Level ${level.level}
                        </strong>

                        <small>
                            ${level.name}
                        </small>

                    </div>


                    <div class="polaris-beyond-stat">

                        <span>🏅</span>

                        <strong>
                            ${badgeCount}/7
                        </strong>

                        <small>
                            Beyond Badges
                        </small>

                    </div>


                    <div class="polaris-beyond-stat">

                        <span>📊</span>

                        <strong>
                            ${completedDays}/${totalDays}
                        </strong>

                        <small>
                            Actions
                        </small>

                    </div>


                </div>


                <!-- ===================================== -->
                <!-- LEVEL PROGRESS -->
                <!-- ===================================== -->

                <div class="polaris-beyond-level-card">

                    <div class="polaris-beyond-level-heading">

                        <div>

                            <strong>
                                Level ${level.level}
                            </strong>

                            <span>
                                ${level.name}
                            </span>

                        </div>


                        <div>

                            ${
                                nextLevel
                                    ? `${state.xp} / ${nextLevel.xp} XP`
                                    : "MAX LEVEL"
                            }

                        </div>

                    </div>


                    <div class="polaris-beyond-level-progress">

                        <div
                            style="width:${levelPercent}%"
                        ></div>

                    </div>


                    <p>

                        ${
                            nextLevel
                                ? `${nextLevel.xp - state.xp} XP until ${nextLevel.name}`
                                : "🚀 You reached the highest Polaris Beyond level!"
                        }

                    </p>

                </div>


                <!-- ===================================== -->
                <!-- BADGES -->
                <!-- ===================================== -->

                <div class="polaris-beyond-badges">

                    <h3>
                        🏅 Beyond Badge Collection
                    </h3>

                    <div class="polaris-beyond-badge-grid">

                        ${
                            Object.entries(
                                polarisBeyondBadges
                            )
                            .map(
                                ([id, badge]) => `

                                    <div
                                        class="
                                            polaris-beyond-badge
                                            ${
                                                state.badges[id]
                                                    ? "earned"
                                                    : "locked"
                                            }
                                        "
                                    >

                                        <span>
                                            ${badge.icon}
                                        </span>

                                        <strong>
                                            ${badge.name}
                                        </strong>

                                        <small>

                                            ${
                                                state.badges[id]
                                                    ? "🏅 Earned"
                                                    : "🔒 Locked"
                                            }

                                        </small>

                                    </div>

                                `
                            )
                            .join("")
                        }

                    </div>

                </div>


                <!-- ===================================== -->
                <!-- CHALLENGES -->
                <!-- ===================================== -->

                <div class="polaris-beyond-challenges">

                    <div class="polaris-beyond-section-heading">

                        <h3>
                            🌍 Beyond Missions
                        </h3>

                        <p>
                            7 advanced missions × 7 days
                            = 49 actions.
                        </p>

                    </div>


                    <div
                        id="polaris-beyond-challenge-grid"
                        class="polaris-beyond-challenge-grid"
                    ></div>

                </div>


                <!-- ===================================== -->
                <!-- FINAL MILESTONE -->
                <!-- ===================================== -->

                ${
                    state.impactLeaderUnlocked
                        ? `

                            <div
                                class="
                                    polaris-beyond-final
                                    unlocked
                                "
                            >

                                <div class="polaris-beyond-final-icon">

                                    🚀

                                </div>

                                <h2>

                                    POLARIS IMPACT LEADER

                                </h2>

                                <p>

                                    You've completed all
                                    49 Beyond actions and
                                    earned all 7 Beyond badges.

                                </p>

                                <strong>

                                    🌍 You didn't just
                                    complete Polaris.
                                    You learned how to
                                    create impact.

                                </strong>

                            </div>

                          `
                        : ""
                }


            </div>

        `;


        const challengeGrid =
            document.getElementById(
                "polaris-beyond-challenge-grid"
            );


        if (!challengeGrid) {

            return;

        }

        Object.entries(
    polarisBeyondChallenges
).forEach(
    ([id, challenge]) => {

        challengeGrid.appendChild(

            createPolarisBeyondChallengeCard(
                id,
                challenge,
                state
            )

        );

    }
);

        // ====================================================
        // START BUTTONS
        // ====================================================

        document
            .querySelectorAll(
                "[data-beyond-start]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        startPolarisBeyondChallenge(
                            button.dataset.beyondStart
                        );

                    }
                );

            });


        // ====================================================
        // COMPLETE BUTTONS
        // ====================================================

        document
            .querySelectorAll(
                "[data-beyond-complete]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        completePolarisBeyondDay(
                            button.dataset.beyondComplete
                        );

                    }
                );

            });

    }


    // ========================================================
    // FINAL COMPLETION CELEBRATION
    // ========================================================

    function showPolarisImpactLeader() {

        const existing =
            document.getElementById(
                "polaris-impact-leader-modal"
            );


        if (existing) {

            existing.remove();

        }


        const modal =
            document.createElement("div");


        modal.id =
            "polaris-impact-leader-modal";


        modal.innerHTML = `

            <div class="polaris-beyond-final-overlay">

                <div class="polaris-beyond-final-modal">

                    <div class="polaris-beyond-final-big-icon">

                        🚀

                    </div>


                    <div class="polaris-beyond-final-earth">

                        🌍

                    </div>


                    <h1>

                        POLARIS IMPACT LEADER

                    </h1>


                    <h2>

                        You've gone beyond.

                    </h2>


                    <p>

                        You completed all 7 Beyond
                        missions and all 49 advanced
                        actions.

                    </p>


                    <div class="polaris-beyond-final-achievements">

                        <span>
                            🔎 Climate Detective
                        </span>

                        <span>
                            🏠 Home Optimizer
                        </span>

                        <span>
                            🍽️ Food Footprint
                        </span>

                        <span>
                            🛍️ Conscious Consumer
                        </span>

                        <span>
                            🌱 Nature Defender
                        </span>

                        <span>
                            🤝 Community Catalyst
                        </span>

                        <span>
                            🚀 Impact Leader
                        </span>

                    </div>


                    <div class="polaris-beyond-final-message">

                        <strong>
                            Polaris Beyond complete.
                        </strong>

                        <br><br>

                        You didn't just track sustainability.
                        You investigated it, measured it,
                        and designed ways to create impact.

                    </div>


                    <button
                        id="close-polaris-impact-leader"
                        class="polaris-beyond-final-button"
                    >

                        🌍 Continue Exploring

                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        setTimeout(
            () => {

                modal.classList.add(
                    "show"
                );

            },
            50
        );


        const closeButton =
            document.getElementById(
                "close-polaris-impact-leader"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    modal.classList.remove(
                        "show"
                    );


                    setTimeout(
                        () => {

                            modal.remove();

                        },
                        400
                    );

                }
            );

        }

    }


    // ========================================================
    // FALLBACK CSS
    // ========================================================
    //
    // This is injected automatically.
    //
    // Therefore Polaris Beyond will still display
    // properly even if your current HTML/CSS does
    // not contain Beyond styling.
    //
    // ========================================================

    function injectPolarisBeyondStyles() {

        if (
            document.getElementById(
                "polaris-beyond-fallback-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement("style");


        style.id =
            "polaris-beyond-fallback-styles";


        style.textContent = `

            /* ==========================================
               POLARIS BEYOND ROOT
               ========================================== */

            #polaris-beyond {

                width: 100%;

                box-sizing: border-box;

            }


            #polaris-beyond.locked {

                opacity: 0.65;

            }


            #polaris-beyond-app {

                width: 100%;

                max-width: 1200px;

                margin: 0 auto;

                padding: 30px 20px;

                box-sizing: border-box;

            }


            /* ==========================================
               DASHBOARD
               ========================================== */

            .polaris-beyond-dashboard {

                width: 100%;

                box-sizing: border-box;

            }


            .polaris-beyond-title {

                display: flex;

                align-items: center;

                gap: 18px;

                margin-bottom: 25px;

            }


            .polaris-beyond-rocket {

                font-size: 3rem;

            }


            .polaris-beyond-title h2 {

                margin: 0 0 6px 0;

                font-size: 2rem;

            }


            .polaris-beyond-title p {

                margin: 0;

                line-height: 1.6;

            }


            /* ==========================================
               STATS
               ========================================== */

            .polaris-beyond-stats {

                display: grid;

                grid-template-columns:
                    repeat(4, minmax(0, 1fr));

                gap: 15px;

                margin-bottom: 20px;

            }


            .polaris-beyond-stat {

                padding: 20px;

                border-radius: 16px;

                background:
                    rgba(46, 125, 50, 0.10);

                text-align: center;

                display: flex;

                flex-direction: column;

                gap: 5px;

            }


            .polaris-beyond-stat span {

                font-size: 1.7rem;

            }


            .polaris-beyond-stat strong {

                font-size: 1.35rem;

            }


            .polaris-beyond-stat small {

                opacity: 0.75;

            }


            /* ==========================================
               LEVEL
               ========================================== */

            .polaris-beyond-level-card {

                padding: 22px;

                border-radius: 16px;

                background:
                    rgba(0, 0, 0, 0.05);

                margin-bottom: 30px;

            }


            .polaris-beyond-level-heading {

                display: flex;

                justify-content: space-between;

                gap: 20px;

                margin-bottom: 12px;

            }


            .polaris-beyond-level-heading div {

                display: flex;

                flex-direction: column;

                gap: 4px;

            }


            .polaris-beyond-level-progress {

                height: 12px;

                border-radius: 20px;

                background:
                    rgba(0, 0, 0, 0.12);

                overflow: hidden;

            }


            .polaris-beyond-level-progress div {

                height: 100%;

                background: #2e7d32;

                border-radius: 20px;

                transition:
                    width 0.5s ease;

            }


            .polaris-beyond-level-card p {

                margin-bottom: 0;

                opacity: 0.7;

                font-size: 0.9rem;

            }


            /* ==========================================
               BADGES
               ========================================== */

            .polaris-beyond-badges {

                margin-bottom: 35px;

            }


            .polaris-beyond-badge-grid {

                display: grid;

                grid-template-columns:
                    repeat(7, minmax(0, 1fr));

                gap: 12px;

            }


            .polaris-beyond-badge {

                padding: 15px 8px;

                border-radius: 14px;

                text-align: center;

                display: flex;

                flex-direction: column;

                align-items: center;

                gap: 6px;

                border: 1px solid
                    rgba(0, 0, 0, 0.10);

            }


            .polaris-beyond-badge span {

                font-size: 2rem;

            }


            .polaris-beyond-badge strong {

                font-size: 0.85rem;

            }


            .polaris-beyond-badge small {

                font-size: 0.75rem;

            }


            .polaris-beyond-badge.locked {

                opacity: 0.45;

                filter: grayscale(0.8);

            }


            .polaris-beyond-badge.earned {

                border-color:
                    rgba(46, 125, 50, 0.45);

            }


            /* ==========================================
               CHALLENGES
               ========================================== */

            .polaris-beyond-section-heading {

                margin-bottom: 20px;

            }


            .polaris-beyond-section-heading h3 {

                margin-bottom: 5px;

            }


            .polaris-beyond-section-heading p {

                margin-top: 0;

                opacity: 0.7;

            }


            .polaris-beyond-challenge-grid {

                display: grid;

                grid-template-columns:
                    repeat(2, minmax(0, 1fr));

                gap: 20px;

            }


            .polaris-beyond-challenge-card {

                border-radius: 18px;

                padding: 22px;

                border: 1px solid
                    rgba(0, 0, 0, 0.12);

                background:
                    rgba(255, 255, 255, 0.8);

                box-sizing: border-box;

            }


            .polaris-beyond-card-header {

                display: flex;

                gap: 15px;

                align-items: flex-start;

                margin-bottom: 18px;

            }


            .polaris-beyond-card-icon {

                font-size: 2.5rem;

                min-width: 45px;

            }


            .polaris-beyond-card-header h3 {

                margin: 0 0 5px 0;

            }


            .polaris-beyond-card-header p {

                margin: 0;

                line-height: 1.5;

                opacity: 0.75;

                font-size: 0.9rem;

            }


            /* ==========================================
               MINI PROGRESS
               ========================================== */

            .polaris-beyond-progress-top {

                display: flex;

                justify-content: space-between;

                margin-bottom: 6px;

            }


            .polaris-beyond-mini-progress {

                height: 8px;

                background:
                    rgba(0, 0, 0, 0.10);

                border-radius: 20px;

                overflow: hidden;

            }


            .polaris-beyond-mini-progress div {

                height: 100%;

                background: #2e7d32;

                border-radius: 20px;

                transition:
                    width 0.4s ease;

            }


            /* ==========================================
               DAY BOXES
               ========================================== */

            .polaris-beyond-days {

                display: grid;

                grid-template-columns:
                    repeat(7, 1fr);

                gap: 6px;

                margin: 18px 0;

            }


            .polaris-beyond-day-box {

                min-height: 35px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 8px;

                background:
                    rgba(0, 0, 0, 0.05);

                font-size: 0.8rem;

            }


            .polaris-beyond-day-box.completed {

                background:
                    rgba(46, 125, 50, 0.15);

            }


            .polaris-beyond-day-box.active {

                background:
                    rgba(46, 125, 50, 0.25);

            }


            /* ==========================================
               ACTION
               ========================================== */

            .polaris-beyond-day-label {

                font-size: 0.75rem;

                font-weight: bold;

                letter-spacing: 0.08em;

                opacity: 0.7;

            }


            .polaris-beyond-task {

                line-height: 1.6;

                min-height: 70px;

            }


            .polaris-beyond-action-button {

                width: 100%;

                padding: 12px 15px;

                border: none;

                border-radius: 10px;

                background: #2e7d32;

                color: white;

                font-weight: bold;

                cursor: pointer;

                transition:
                    transform 0.2s ease,
                    opacity 0.2s ease;

            }


            .polaris-beyond-action-button:hover {

                transform:
                    translateY(-1px);

            }


            .polaris-beyond-action-button:disabled {

                opacity: 0.55;

                cursor: not-allowed;

                transform: none;

            }


            .polaris-beyond-complete-label {

                padding: 12px;

                border-radius: 10px;

                text-align: center;

                background:
                    rgba(46, 125, 50, 0.12);

            }


            /* ==========================================
               EARNED BADGE
               ========================================== */

            .polaris-beyond-earned-badge {

                margin-top: 18px;

                padding-top: 15px;

                border-top: 1px solid
                    rgba(0, 0, 0, 0.10);

                display: flex;

                align-items: center;

                gap: 8px;

                flex-wrap: wrap;

                font-size: 0.85rem;

            }


            .polaris-beyond-badge-earned {

                margin-left: auto;

                font-weight: bold;

            }


            /* ==========================================
               FINAL COMPLETION
               ========================================== */

            .polaris-beyond-final {

                margin-top: 35px;

                padding: 35px;

                border-radius: 22px;

                text-align: center;

                background:
                    linear-gradient(
                        135deg,
                        rgba(46,125,50,0.16),
                        rgba(76,175,80,0.08)
                    );

                border: 2px solid
                    rgba(46,125,50,0.30);

            }


            .polaris-beyond-final-icon {

                font-size: 4rem;

            }


            .polaris-beyond-final h2 {

                margin-bottom: 8px;

            }


            .polaris-beyond-final p {

                line-height: 1.6;

            }


            /* ==========================================
               FINAL MODAL
               ========================================== */

            #polaris-impact-leader-modal {

                position: fixed;

                inset: 0;

                z-index: 30000;

            }


            .polaris-beyond-final-overlay {

                position: absolute;

                inset: 0;

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                background:
                    rgba(0, 0, 0, 0.70);

            }


            .polaris-beyond-final-modal {

                max-width: 650px;

                width: 100%;

                max-height: 90vh;

                overflow-y: auto;

                padding: 40px;

                border-radius: 24px;

                background: white;

                text-align: center;

                transform:
                    scale(0.9);

                opacity: 0;

                transition:
                    all 0.4s ease;

                box-sizing: border-box;

            }


            #polaris-impact-leader-modal.show
            .polaris-beyond-final-modal {

                transform:
                    scale(1);

                opacity: 1;

            }


            .polaris-beyond-final-big-icon {

                font-size: 4rem;

            }


            .polaris-beyond-final-earth {

                font-size: 3rem;

            }


            .polaris-beyond-final-modal h1 {

                margin-bottom: 5px;

            }


            .polaris-beyond-final-modal h2 {

                margin-top: 0;

            }


            .polaris-beyond-final-achievements {

                display: flex;

                flex-wrap: wrap;

                justify-content: center;

                gap: 8px;

                margin: 20px 0;

            }


            .polaris-beyond-final-achievements span {

                padding: 8px 10px;

                border-radius: 20px;

                background:
                    rgba(46,125,50,0.10);

                font-size: 0.85rem;

            }


            .polaris-beyond-final-message {

                padding: 18px;

                border-radius: 14px;

                background:
                    rgba(0,0,0,0.05);

                line-height: 1.6;

                margin-bottom: 20px;

            }


            .polaris-beyond-final-button {

                padding: 13px 22px;

                border: none;

                border-radius: 10px;

                background: #09ff16;

                color: white;

                font-weight: bold;

                cursor: pointer;

            }

                        /* ==========================================
               INPUT WARNINGS
               ========================================== */

            #inputWarnings {

                width: 100%;

                margin: 20px 0;

                box-sizing: border-box;

            }


            .input-warning-title {

                font-weight: bold;

                margin-bottom: 10px;

            }


            .input-warning {

                padding: 12px 15px;

                margin-bottom: 8px;

                border-radius: 10px;

                border: 1px solid
                    rgba(224, 168, 0, 0.45);

                background:
                    rgba(255, 193, 7, 0.10);

                line-height: 1.5;

            }
                
            /* ==========================================
               RESPONSIVE
               ========================================== */

            @media (max-width: 900px) {

                .polaris-beyond-stats {

                    grid-template-columns:
                        repeat(2, 1fr);

                }


                .polaris-beyond-badge-grid {

                    grid-template-columns:
                        repeat(4, 1fr);

                }


                .polaris-beyond-challenge-grid {

                    grid-template-columns: 1fr;

                }

            }


            @media (max-width: 600px) {

                .polaris-beyond-stats {

                    grid-template-columns: 1fr 1fr;

                }


                .polaris-beyond-badge-grid {

                    grid-template-columns:
                        repeat(2, 1fr);

                }


                .polaris-beyond-title {

                    align-items: flex-start;

                }


                .polaris-beyond-level-heading {

                    flex-direction: column;

                }


                .polaris-beyond-final-modal {

                    padding: 25px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ========================================================
    // INITIALIZE
    // ========================================================

    function initializePolarisBeyond() {

        injectPolarisBeyondStyles();


        const section =
            document.getElementById(
                "polaris-beyond"
            );


        if (!section) {

            console.warn(
                "Polaris Beyond: #polaris-beyond section was not found."
            );


            return;

        }


        const unlocked =
            localStorage.getItem(
                POLARIS_BEYOND_UNLOCK_KEY
            ) === "true";


        if (unlocked) {

            renderPolarisBeyond();

        }

    }


    // ========================================================
    // WAIT FOR DOM
    // ========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePolarisBeyond
        );

    }

    else {

        initializePolarisBeyond();

    }


    // ========================================================
    // PUBLIC TESTING FUNCTIONS
    // ========================================================

    window.resetPolarisForTesting =
        function () {

            localStorage.removeItem(
                POLARIS_BEYOND_STORAGE_KEY
            );


            localStorage.removeItem(
                POLARIS_BEYOND_UNLOCK_KEY
            );


            const section =
                document.getElementById(
                    "polaris-beyond"
                );


            if (section) {

                section.classList.add(
                    "locked"
                );

                section.classList.remove(
                    "unlocked"
                );

            }


            console.log(
                "🧪 Polaris Beyond has been reset."
            );

        };

    function resetPolarisForTesting() {
    Object.keys(localStorage).forEach(key => {
        if (
            key.startsWith("polarisChallenge_") ||
            key === "polarisBadges" ||
            key === "polarisGuardianUnlocked" ||
            key === "polarisBeyondUnlocked"
        ) {
            localStorage.removeItem(key);
        }
    });

    location.reload();
}

function unlockPolarisBeyondForTesting() {
    localStorage.setItem("polarisGuardianUnlocked", "true");
    localStorage.setItem("polarisBeyondUnlocked", "true");

    location.reload();
}

/* ============================================================
   PROJECT POLARIS
   Sustainable Living Platform
   UI DESIGN SYSTEM
   ============================================================ */
