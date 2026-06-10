export default function Ethics() {

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-4xl mx-auto bg-white shadow rounded p-8">

                <h1 className="text-3xl font-bold mb-6">
                    AI Ethics & Privacy Notice
                </h1>

                {/* PRIVACY */}
                <section className="mb-6">

                    <h2 className="text-xl font-bold mb-2">
                        Privacy & Data Protection
                    </h2>

                    <p className="text-gray-700 leading-7">
                        This prototype uses synthetic learner data for educational
                        and demonstration purposes only. No real personal data
                        should be uploaded without proper consent and approval.
                    </p>

                </section>

                {/* CONSENT */}
                <section className="mb-6">

                    <h2 className="text-xl font-bold mb-2">
                        Consent & Responsible Use
                    </h2>

                    <p className="text-gray-700 leading-7">
                        Programme staff should ensure that learners are informed
                        about how their information will be collected, analysed,
                        and used to improve support interventions.
                    </p>

                </section>

                {/* AI LIMITATIONS */}
                <section className="mb-6">

                    <h2 className="text-xl font-bold mb-2">
                        AI Recommendations & Human Oversight
                    </h2>

                    <p className="text-gray-700 leading-7">
                        The system provides support-risk indicators and automated
                        insights based on predefined logic. Final decisions
                        regarding learner support must always involve human review
                        and professional judgement.
                    </p>

                </section>

                {/* BIAS */}
                <section className="mb-6">

                    <h2 className="text-xl font-bold mb-2">
                        Bias & Fairness
                    </h2>

                    <p className="text-gray-700 leading-7">
                        Automated systems may unintentionally introduce bias if
                        datasets are incomplete or unrepresentative. Programme
                        teams should regularly review outcomes to ensure fairness
                        and avoid discrimination.
                    </p>

                </section>

                {/* SECURITY */}
                <section>

                    <h2 className="text-xl font-bold mb-2">
                        Data Security
                    </h2>

                    <p className="text-gray-700 leading-7">
                        Access to learner information should be restricted to
                        authorised personnel only. Sensitive information should
                        be securely stored and protected against unauthorised
                        access.
                    </p>

                </section>

            </div>

        </div>
    );
}