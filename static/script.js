// =======================================
// PROJECT POLARIS - MAIN JAVASCRIPT
// =======================================

document.addEventListener("DOMContentLoaded", function () {


    // =======================================
    // SHOW / HIDE TIPS
    // =======================================

    const toggleButtons =
        document.querySelectorAll(".toggle-btn");

    toggleButtons.forEach(button => {

        const tips = button.nextElementSibling;

        if (!tips) return;

        button.addEventListener("click", function () {

            tips.classList.toggle("visible");

            button.textContent =
                tips.classList.contains("visible")
                    ? "Hide Tips"
                    : "Show Tips";

        });

    });


    // =======================================
    // DARK MODE
    // =======================================

    const darkModeBtn =
        document.createElement("button");

    darkModeBtn.textContent = "🌙 Dark Mode";

    Object.assign(darkModeBtn.style, {

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

    });

    document.body.appendChild(darkModeBtn);


    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );

            darkModeBtn.textContent =
                document.body.classList.contains("dark-mode")
                    ? "☀️ Light Mode"
                    : "🌙 Dark Mode";

        }
    );


    // =======================================
    // SLIDERS
    // =======================================

    const sliders =
        document.querySelectorAll(".eco-slider");

    sliders.forEach(slider => {

        const value =
            slider.parentElement?.querySelector(
                ".slider-value"
            );

        if (!value) return;

        value.textContent = slider.value;

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
                        typeof Chart !== "undefined"
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

                                                beginAtZero: true,

                                                title: {

                                                    display: true,

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
    // ECO BADGES
    // =======================================

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
            pathParts[pathParts.length - 1];

    }


    // =======================================
    // GET UNLOCKED BADGES
    // =======================================

    function getUnlockedBadges() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "polarisBadges"
                    )
                );


            return Array.isArray(saved)
                ? saved
                : [];

        }

        catch {

            return [];

        }

    }


    // =======================================
    // UPDATE BADGE DISPLAY
    // =======================================

    function updateBadgeDisplay() {

        const unlockedBadges =
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
                    unlockedBadges.includes(
                        badgeId
                    )
                ) {

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


        const earned =
            unlockedBadges.length;


        const total =
            Object.keys(
                ecoBadges
            ).length;


        const earnedElement =
            document.getElementById(
                "badges-earned"
            );


        const progressFill =
            document.getElementById(
                "badge-progress-fill"
            );


        if (earnedElement) {

            earnedElement.textContent =
                earned;

        }


        if (progressFill) {

            const percentage =
                total === 0
                    ? 0
                    : (earned / total) * 100;


            progressFill.style.width =
                percentage + "%";

        }

    }


    updateBadgeDisplay();


    // =======================================
    // CHALLENGE SYSTEM
    // ONLY RUNS ON CHALLENGE PAGES
    // =======================================

    if (
        challengeId &&
        challengeTasks[challengeId]
    ) {

        setupChallenge(
            challengeId
        );

    }


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
                ).padStart(2, "0");


            const day =
                String(
                    now.getDate()
                ).padStart(2, "0");


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


            // Not started

            if (!progress.started) {

                todayAction.textContent =
                    "Start the challenge to reveal your first action. 🌱";

                return;

            }


            // Complete

            if (
                progress.completedDays.length >= 7
            ) {

                todayAction.textContent =
                    "🎉 You completed all 7 challenge days!";

                return;

            }


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


                    // Completed

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


                    // Next available day

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


                    // Locked

                    else {

                        if (status) {

                            status.textContent =
                                "🔒";

                        }

                    }

                });

        }


        // ===================================
        // UPDATE UI
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
            // COMPLETE
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
            // STARTED
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


                // Challenge must be started

                if (!progress.started) {

                    return;

                }


                // Never exceed seven days

                if (
                    progress.completedDays.length >= 7
                ) {

                    return;

                }


                const today =
                    getToday();


                // Same-day protection

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


                // Determine next day

                const nextDay =
                    progress.completedDays.length +
                    1;


                // Safety check

                if (
                    nextDay < 1 ||
                    nextDay > 7
                ) {

                    return;

                }


                // Record completion

                progress.completedDays.push(
                    nextDay
                );


                progress.lastCompletedDate =
                    today;


                saveProgress();


                // Unlock badge after Day 7

                if (
                    progress.completedDays.length === 7
                ) {

                    unlockBadge();

                }


                // Refresh page

                window.location.reload();

            }
        );


        // ===================================
        // UNLOCK BADGE
        // ===================================

        function unlockBadge() {

            const badge =
                ecoBadges[id];


            if (!badge) {

                return;

            }


            const unlocked =
                getUnlockedBadges();


            if (
                !unlocked.includes(id)
            ) {

                unlocked.push(id);


                localStorage.setItem(

                    "polarisBadges",

                    JSON.stringify(
                        unlocked
                    )

                );

            }


            if (badgeBox) {

                badgeBox.classList.remove(
                    "hidden"
                );

            }


            if (badgeName) {

                badgeName.textContent =
                    badge.icon +
                    " " +
                    badge.name;

            }


            updateBadgeDisplay();

        }


        // ===================================
        // SHOW BADGE
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
        // INITIALIZE
        // ===================================

        updateUI();

    }

});


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