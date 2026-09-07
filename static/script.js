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

    const guardianAlreadyUnlocked =
        localStorage.getItem(
            "polarisGuardianUnlocked"
        );


    /*
     * If already unlocked, don't show
     * the giant celebration again.
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
     * Unlock the next stage.
     */

    unlockPolarisBeyond();


    /*
     * Small delay so the seventh badge
     * can appear first.
     */

    setTimeout(
        showPolarisCompletion,
        700
    );

}


// =======================================
// 🚀 POLARIS BEYOND
// =======================================

function unlockPolarisBeyond() {

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
// 🧪 TESTING — RESET ENERGY SAVER
// =======================================

/*
 * RUN THIS ONCE IN THE BROWSER CONSOLE:
 *
 * resetEnergySaverForTesting();
 *
 * This locks Energy Saver again.
 *
 * DO NOT put this inside DOMContentLoaded.
 */

function resetEnergySaverForTesting() {

    const badges =
        getUnlockedBadges();


    badges["energy-saver"] = false;


    saveBadges(badges);


    /*
     * Also reset the final completion state
     * if you were previously testing it.
     */

    localStorage.removeItem(
        "polarisGuardianUnlocked"
    );


    localStorage.removeItem(
        "polarisBeyondUnlocked"
    );


    updateBadgeDisplay();


    console.log(
        "🧪 Energy Saver has been reset to LOCKED."
    );

}


// =======================================
// 🧪 TESTING — RESET ALL BADGES
// =======================================

/*
 * USE THIS ONLY WHEN YOU WANT TO
 * SIMULATE A BRAND-NEW USER.
 *
 * resetAllBadgesForTesting();
 */

function resetAllBadgesForTesting() {

    const defaults =
        createDefaultBadgeState();


    saveBadges(defaults);


    localStorage.removeItem(
        "polarisGuardianUnlocked"
    );


    localStorage.removeItem(
        "polarisBeyondUnlocked"
    );


    updateBadgeDisplay();


    console.log(
        "🧪 All Polaris badges reset."
    );

}


// =======================================
// CHALLENGE TASKS
// =======================================

const challengeTasks = {

    "energy-saver": [

        "🔎 Energy Audit: Walk through your home and identify three lights or electronic devices that are unnecessarily running. Turn them off and record what you changed.",

        "🔌 Standby Check: Find at least three devices that remain plugged in when not being used. Unplug them safely and identify which devices were consuming standby energy.",

        "💡 Lighting Challenge: Choose one room and rely on natural daylight instead of artificial lighting for at least 30 minutes today.",

        "⚡ Electronics Check: Review your household electronics and activate an energy-saving or sleep setting on at least two devices.",

        "🏠 Energy Hunt: Find one habit in your home that wastes electricity. Change that habit for the rest of today.",

        "📊 Energy Reflection: Review today's electricity-saving actions and identify two changes you could continue permanently.",

        "🌱 Final Energy Audit: Complete a full walk-through of your home before bed. Switch off unnecessary lights, electronics, and standby devices."

    ],


    "water-warrior": [

        "💧 Tap Challenge: Turn off the tap while brushing your teeth and estimate how much water you avoided wasting.",

        "🚿 Shower Challenge: Reduce your shower time compared with your normal routine and record approximately how many minutes you saved.",

        "🔎 Leak Hunt: Inspect taps, toilets, and visible pipes for signs of leaks. Report or fix one problem if you find one.",

        "🪣 Water Use Audit: Identify one activity where water is commonly left running unnecessarily and change the way you do it today.",

        "💦 Measured Use: During one household activity involving water, deliberately use only the amount you actually need.",

        "♻️ Reuse Challenge: Find one safe way to reuse water that would normally be discarded, such as water from rinsing produce.",

        "🌊 Final Water Audit: Walk through your home and identify three opportunities to reduce water waste. Put at least one improvement into practice."

    ],


    "food-hero": [

        "🍽️ Portion Challenge: At your next meal, take a realistic portion that you are confident you can finish. Avoid putting unnecessary food on your plate.",

        "🥡 Leftover Mission: Check your refrigerator and identify one leftover that should be eaten soon. Plan when you will eat it.",

        "🔎 Food Inventory: Before buying food, inspect your refrigerator and pantry and make a short list of items you already have.",

        "📅 Expiry Check: Find at least three foods approaching their expiry or best-before dates and decide how you can use them before they are wasted.",

        "📝 Meal Planning: Plan your meals for tomorrow using ingredients you already have at home before considering buying anything new.",

        "🍲 Leftover Creation: Transform one leftover ingredient or meal into a new meal instead of throwing it away.",

        "🌱 Food Waste Audit: Review the food you threw away this week and identify the main reason it became waste. Choose one change to prevent it."

    ],


    "plastic-patrol": [

        "💧 Reusable Bottle Mission: Use a reusable water bottle throughout the day instead of purchasing a single-use plastic bottle.",

        "🛍️ Bag Challenge: Complete a shopping trip using reusable bags and avoid accepting unnecessary plastic bags.",

        "🥡 Container Challenge: Use a reusable container or lunchbox instead of a disposable food container for one meal.",

        "🚫 Single-Use Audit: Track unnecessary single-use plastic items you encounter today and identify which ones you could replace.",

        "♻️ Packaging Investigation: Choose one product you are buying and compare whether a lower-packaging alternative is available.",

        "🌎 Plastic-Free Swap: Replace at least two disposable plastic items you normally use with reusable alternatives.",

        "📊 Plastic Audit: Count how many unnecessary single-use plastic items you avoided this week and identify your biggest opportunity for improvement."

    ],


    "energy-guardian": [

        "🔥 Burner Efficiency: Match the burner size to the size of your cookware instead of using a larger flame than necessary.",

        "🍳 Heat Challenge: Cover a pot or pan while cooking one meal and observe how efficiently the food heats.",

        "🔥 Flame Check: During cooking, make sure the flame is not unnecessarily high and reduce it once the food is properly heating.",

        "🔎 Equipment Audit: Check your cooking equipment for obvious inefficiencies, such as damaged cookware or burners that are not functioning normally.",

        "🍲 Cookware Challenge: Choose cookware that fits the burner properly and avoid allowing heat to escape around the sides.",

        "⏱️ Heat Management: Once food reaches the required cooking temperature, reduce the flame instead of maintaining an unnecessarily high setting.",

        "🌱 Final Fuel Audit: Review your cooking habits from the week and identify two changes that could permanently reduce cooking-fuel use."

    ],


    "green-journey": [

        "🚶 Short-Trip Challenge: Replace one short car journey with walking or cycling if the route is safe and practical.",

        "🚌 Public Transport Mission: Use public transportation for one journey that you would normally make by private vehicle, where practical.",

        "🚗 Ride-Share Challenge: Combine a journey with another household member or share transportation instead of making separate trips.",

        "📍 Route Planning: Combine at least two errands into one journey to avoid making multiple separate trips.",

        "🚫 Journey Reduction: Identify one trip that is not essential and avoid making it today.",

        "🚲 Active Travel: Complete one short journey by walking or cycling instead of using a motor vehicle, if safe.",

        "🌱 Weekly Transport Audit: Review your journeys from the week and identify the biggest opportunity to reduce transportation emissions."

    ],


    "sky-impact": [

        "✈️ Flight Necessity Check: Think of a future flight you may take and identify whether the journey is necessary or whether another option could work.",

        "🚆 Alternative Transport: For a hypothetical or upcoming journey, investigate whether rail, bus, or another lower-emission option could replace flying.",

        "🗺️ Trip Planning: Combine activities or destinations into fewer journeys when planning future travel.",

        "📅 Future Travel Audit: Review one upcoming trip and identify one way you could reduce its environmental impact.",

        "🚆 Ground Travel Challenge: Choose one journey where ground transportation could realistically replace air travel.",

        "✈️ Short-Flight Check: Identify whether any future short-distance flight could reasonably be replaced by another mode of transportation.",

        "🌍 Travel Reflection: Review your travel choices and write down two principles you will use to make lower-carbon travel decisions in the future."

    ]

};


// =======================================
// MAIN DOM CONTENT LOADED
// =======================================

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

                            recommendation.textContent =
                                createRecommendation(
                                    data
                                );

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
