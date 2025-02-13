import { Switch } from "antd"

const Subscription = () => <div className="p-2 overflow-auto">
    <h1 className="text-xl font-semibold sm:pt-10 lg:pt-2">Subscription</h1>
    <div className="flex sm:flex-col lg:flex-row flex-wrap mt-3 ">
        <div className="shadow-xl outline lg:w-1/5 sm:w-1/2 rounded m-2 ">
            <Switch className=" m-2" />
            <div className="flex flex-col justify-center items-center">
                <h1 >Free</h1>
                <img src="https://s3-alpha-sig.figma.com/img/e0f6/ba85/9941adab5aa94e793b68a430fa3c454c?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YKERHzcIqP3i559PB8Q-f-3uqF5h94VrwYcSJs4rENPcTn9Gz4K6kcQMFIfVrYAUS4wYmRseXdeJGMtLTI9aZDDByj0THBXJNknZU4mSQYlMei5-5FpD-x5RpFegLD-ofhUGb2Q~ROvyrCzD2mh6el1nGSvajITdEGxUacMzEkUksjkyu3qYJBGG8KhNJtovNKdwLSf7z9Mo7W-mEYfC-yHEKJV5895Dsv1PJBTF2rMmnqWdaSGdZpHMh7JdibavI1xnClJtEqoLBUJEmLiqoxxnFnolSycfsU61lMY4rlq1~lJHUjME1XROAG2pNASjJqTJ7IzM~4bz6nP1i0smUQ__" className="w-10 h-10 m-2" />
                <hr className="border-t border-gray-300 w-4/5 my-2" />
                <p className="text-center text-base">Pay fee in easy (interest free) instalments. You can choose
                    from monthly / quarterly payment options.</p>
                <div className="m-3">
                    <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md" type="button">Free</button>
                </div>
            </div>
        </div>
        <div className="shadow-xl outline lg:w-1/5 sm:w-1/2 rounded  m-2 ">
            <Switch className=" m-2" />
            <div className="flex flex-col justify-center items-center">
                <h1 >Silver</h1>
                <img src="https://s3-alpha-sig.figma.com/img/e0f6/ba85/9941adab5aa94e793b68a430fa3c454c?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YKERHzcIqP3i559PB8Q-f-3uqF5h94VrwYcSJs4rENPcTn9Gz4K6kcQMFIfVrYAUS4wYmRseXdeJGMtLTI9aZDDByj0THBXJNknZU4mSQYlMei5-5FpD-x5RpFegLD-ofhUGb2Q~ROvyrCzD2mh6el1nGSvajITdEGxUacMzEkUksjkyu3qYJBGG8KhNJtovNKdwLSf7z9Mo7W-mEYfC-yHEKJV5895Dsv1PJBTF2rMmnqWdaSGdZpHMh7JdibavI1xnClJtEqoLBUJEmLiqoxxnFnolSycfsU61lMY4rlq1~lJHUjME1XROAG2pNASjJqTJ7IzM~4bz6nP1i0smUQ__" className="w-10 h-10 m-2" />
                <hr className="border-t border-gray-300 w-4/5 my-2" />
                <p className="text-center text-base">Pay fee in easy (interest free) instalments. You can choose
                    from monthly / quarterly payment options.</p>
                <div className="m-3">
                    <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md" type="button">Silver</button>
                </div>
            </div>
        </div>
        <div className="shadow-xl outline lg:w-1/5 sm:w-1/2  rounded  m-2 ">
            <Switch className=" m-2" />
            <div className="flex flex-col justify-center items-center">
                <h1 >Gold</h1>
                <img src="https://s3-alpha-sig.figma.com/img/7041/0cdc/8db98d4e5a1966a3635c40a18dd3dffc?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=M8PtRdJEfyr-3VydNpt-p9TXTIS62MZ0ulEuOlrUUschE3gGKFQGahdq9362CTT8G921CCk4WPGiZR4AgZqFozIOt32ER6Gwwf44PEQYTunLMLC744-CsRCwlHd9ggY0l88eSWuCFHJIwm8GGpAbObljaHpidXcFpop1keQ8az3fqBN8TuDv7XoyeqGl6i30Qvri9d3mozteTOGplSpur6FkS21RmOVcpZHI6nmfVYMmZXWvfhqEH4wFOgJPQe1Iaoa17eYm8m~JZyC3h325JwQCUS7jOnPxfRJm-ry6UOI4eUc-UD03ACm4a9gbbvAhl~HwJJFco8cCzt9WH56IDQ__" className="w-10 h-10 m-2" />
                <hr className="border-t border-gray-300 w-4/5 my-2" />
                <p className="text-center text-base">Pay fee in easy (interest free) instalments. You can choose
                    from monthly / quarterly payment options.</p>
                <div className="m-3">
                    <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md" type="button">Gold</button>
                </div>
            </div>
        </div>
        <div className="shadow-xl outline lg:w-1/5 sm:w-1/2  rounded m-2 ">
            <Switch className=" m-2" />
            <div className="flex flex-col justify-center items-center">
                <h1 >Platinum</h1>
                <img src="https://s3-alpha-sig.figma.com/img/0af0/8347/bec87743630eb6bff408545d4d4a9ccf?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ox5La6UMJqx23pXPseTqE7srdLyUbI4oYupm6Cr~ajnqspYoCis9-TmQ603zaWbScxB88qhpGnVNsWg7R2B30WsvJs7rYOkRppjGL5zP4oGdcPYDsAssmepNpbOPY7d6RSg3VW-TziEXbKDje~DJPGOEbf5-8oohlzztMZ1TZ5AMVaIL7AiIxz3yEpUOezdLgL3D~2q~s0pgtNPPre3Iua4rp1H80S8T0jMHxVmIrM-jhcGhGxzkzCMCeHvyTHbBQSjIv8f6gYTsNpMnpdvg4B-Q6HVMNTVnuZCWy3Z4hW1ZvDyOTQPUgpXvW4JpksJbtYR1hATtsgQh0H6usr5~ow__" className="w-10 h-10 m-2" />
                <hr className="border-t border-gray-300 w-4/5 my-2" />
                <p className="text-center text-base">Pay fee in easy (interest free) instalments. You can choose
                    from monthly / quarterly payment options.</p>
                <div className="m-3">
                    <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md" type="button">Platinum</button>
                </div>
            </div>
        </div>
    </div>
</div>


export default Subscription