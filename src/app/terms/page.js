'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav'; // <--- Imports the NEW Floating Nav
import { Shield, Info, Scale, AlertCircle, AlertTriangle, Lock, FileCheck } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-32">
       {/* --- BACKGROUND LAYERS --- */}
       <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50 z-0"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      ></div>

      <div className="relative z-10">
        <Header />
        
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent border-b-2 border-red-100 pb-4">
              শর্তাবলী ও দায়মুক্তি (Terms & Conditions)
            </h1>

            <div className="space-y-8 text-gray-700 text-base md:text-lg">
              {/* Section 1 - Our Role */}
              <section className="bg-amber-50/60 border-l-8 border-amber-400 p-6 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="text-amber-600" /> ১. আমাদের ভূমিকা - আমরা কে এবং কে নই
                </h2>
                <div className="space-y-4">
                  <p className="leading-relaxed font-semibold text-amber-900">
                    গুরুত্বপূর্ণ: SattyoAlert একটি সেতু (Bridge), সত্যতা যাচাইকারী নয়।
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                    <p className="font-bold text-gray-900 mb-2">✅ আমরা যা করি:</p>
                    <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
                      <li>আপনার রিপোর্ট যাচাইকৃত ফ্যাক্ট-চেকারদের কাছে পাঠাই</li>
                      <li>ফ্যাক্ট-চেকারদের উত্তর আপনার কাছে পৌঁছে দিই</li>
                      <li>তথ্য বিতরণ ও সংযোগ স্থাপন করি</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                    <p className="font-bold text-gray-900 mb-2">❌ আমরা যা করি না:</p>
                    <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
                      <li>নিজেরা তথ্য যাচাই করি না</li>
                      <li>ফ্যাক্ট-চেকারদের সিদ্ধান্ত পরিবর্তন করি না</li>
                      <li>যাচাইয়ের প্রক্রিয়ায় হস্তক্ষেপ করি না</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2 - Fact-Checker Independence */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" /> ২. ফ্যাক্ট-চেকারদের স্বাধীনতা
                </h2>
                <div className="space-y-3 pl-4 border-l-2 border-purple-100">
                  <p className="leading-relaxed">
                    আমরা যাচাইকৃত এবং স্বীকৃত ফ্যাক্ট-চেকিং সংস্থার সাথে কাজ করি যেমন:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 font-medium">
                    <li>Boom Bangladesh</li>
                    <li>Rumor Scanner</li>
                    <li>AFP Fact Check Bangladesh</li>
                    <li>অন্যান্য IFCN-যাচাইকৃত সংস্থা</li>
                  </ul>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-3 border border-blue-100">
                    <p className="font-bold text-blue-900 mb-2">📌 গুরুত্বপূর্ণ:</p>
                    <ul className="list-disc list-inside space-y-1 text-base text-blue-800">
                      <li>ফ্যাক্ট-চেকাররা সম্পূর্ণ স্বাধীনভাবে কাজ করেন</li>
                      <li>তারা তাদের নিজস্ব পদ্ধতি অনুসরণ করেন</li>
                      <li>আমরা তাদের সিদ্ধান্তে চাপ দিতে বা পরিবর্তন করতে পারি না</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 - Liability & Disclaimer */}
              <section className="bg-red-50/60 border-l-8 border-red-500 p-6 rounded-r-xl shadow-sm">
                <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <Scale className="text-red-600" /> ৩. দায়বদ্ধতা ও দায়মুক্তি (CRITICAL)
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                    <p className="font-bold text-red-700 mb-2">৩.১ তথ্যের নির্ভুলতা</p>
                    <p className="text-base leading-relaxed text-gray-700">
                      আমরা যাচাইকৃত ফ্যাক্ট-চেকারদের থেকে তথ্য পেয়ে বিতরণ করি। যদিও আমরা শুধুমাত্র 
                      বিশ্বাসযোগ্য উৎসের সাথে কাজ করি, <strong className="text-red-700">আমরা ১০০% নির্ভুলতার 
                      গ্যারান্টি দিতে পারি না</strong>।
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                    <p className="font-bold text-red-700 mb-2">৩.২ আমাদের দায়বদ্ধতার সীমা</p>
                    <p className="text-base leading-relaxed mb-2">
                      <strong>SattyoAlert, এর প্রতিষ্ঠাতা, টিম, বা অংশীদাররা দায়ী নয়:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-base text-gray-700 ml-2">
                      <li>ফ্যাক্ট-চেকারদের সিদ্ধান্তের জন্য (তারা স্বাধীন)</li>
                      <li>আমাদের প্ল্যাটফর্মে প্রদর্শিত তথ্যের ভুলের জন্য</li>
                      <li>আর্থিক, ব্যক্তিগত, বা অন্য কোনো ক্ষতির জন্য</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                    <p className="font-bold text-red-700 mb-2">৩.৩ ব্যবহারকারীর দায়িত্ব</p>
                    <p className="text-base leading-relaxed">
                      প্ল্যাটফর্ম ব্যবহার করে, আপনি স্বীকার করছেন যে আপনি নিজের বিচার-বিবেচনা ব্যবহার করবেন এবং তথ্যের জন্য শুধুমাত্র আমাদের ওপর নির্ভর করবেন না।
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4 - Error Correction */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-green-600" /> ৪. ভুল সংশোধন প্রক্রিয়া
                </h2>
                <div className="space-y-3 pl-4 border-l-2 border-green-100">
                  <p className="leading-relaxed">
                    যদি আপনি মনে করেন আমাদের প্ল্যাটফর্মে ভুল তথ্য প্রদর্শিত হচ্ছে:
                  </p>
                  
                  <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                    <p className="font-bold text-emerald-900 mb-2">📝 পদক্ষেপ:</p>
                    <ol className="list-decimal list-inside space-y-2 text-base text-emerald-800">
                      <li><strong>যোগাযোগ করুন:</strong> contact@sattyoalert.com এ ইমেইল করুন</li>
                      <li><strong>বিস্তারিত দিন:</strong> কোন যাচাই, কোন তারিখ, কি ভুল</li>
                      <li><strong>প্রমাণ দিন:</strong> যদি থাকে, বিকল্প উৎস সংযুক্ত করুন</li>
                      <li><strong>অপেক্ষা করুন:</strong> আমরা ২৪-৪৮ ঘন্টার মধ্যে পর্যালোচনা করব</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Section 5 - Conflicts */}
              <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ৫. দ্বন্দ্বপূর্ণ যাচাই ফলাফল
                </h2>
                <div className="space-y-2 text-base">
                  <p className="leading-relaxed">
                    কখনো কখনো বিভিন্ন ফ্যাক্ট-চেকার একই দাবিতে ভিন্ন সিদ্ধান্তে পৌঁছাতে পারেন। এ ক্ষেত্রে আমরা:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 font-medium ml-2">
                    <li>সব মতামত প্রদর্শন করব - কোনোটি লুকাব না</li>
                    <li>প্রতিটি ফ্যাক্ট-চেকারের পদ্ধতি স্পষ্ট করব</li>
                    <li>ব্যবহারকারীকে সিদ্ধান্ত নিতে দেব</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 - User Responsibilities */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ৬. ব্যবহারকারীর দায়িত্ব ও নিষিদ্ধ কর্মকাণ্ড
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm">
                    <p className="font-bold text-red-700 mb-3 border-b border-red-200 pb-2">❌ নিষিদ্ধ:</p>
                    <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                      <li><strong>মিথ্যা রিপোর্ট:</strong> জেনেশুনে ভুল দাবি জমা দেওয়া</li>
                      <li><strong>স্প্যাম:</strong> একই রিপোর্ট বারবার পাঠানো</li>
                      <li><strong>হয়রানি:</strong> ব্যক্তিগত আক্রমণ বা ডক্সিং</li>
                      <li><strong>ঘৃণামূলক বিষয়বস্তু:</strong> বৈষম্য বা হিংসার উস্কানি</li>
                      <li><strong>অপব্যবহার:</strong> সিস্টেম হ্যাক বা ম্যানিপুলেশন</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm">
                    <p className="font-bold text-green-700 mb-3 border-b border-green-200 pb-2">✅ উৎসাহিত:</p>
                    <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                      <li>সঠিক ও নির্দিষ্ট দাবি জমা দিন</li>
                      <li>সম্ভব হলে উৎস লিংক যুক্ত করুন</li>
                      <li>সম্মানজনক ভাষা ব্যবহার করুন</li>
                      <li>দাবি যাচাই করুন, ব্যক্তিকে নয়</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 - Account Suspension */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ৭. অ্যাকাউন্ট স্থগিতকরণ
                </h2>
                <p className="leading-relaxed mb-3">
                  নিম্নলিখিত কারণে আমরা সেবা প্রত্যাখ্যান বা স্থগিত করতে পারি:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg inline-block w-full">
                  <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                    <li><strong>প্রথম লঙ্ঘন:</strong> সতর্কতা + ২৪ ঘন্টা স্থগিতকরণ</li>
                    <li><strong>দ্বিতীয় লঙ্ঘন:</strong> ৭ দিন স্থগিতকরণ</li>
                    <li><strong>গুরুতর লঙ্ঘন:</strong> স্থায়ী নিষেধাজ্ঞা</li>
                  </ul>
                </div>
              </section>

              {/* Section 8 - Privacy & Data */}
              <section className="bg-purple-50/50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> ৮. গোপনীয়তা ও ডেটা সুরক্ষা
                </h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-gray-900 mb-2">আমরা যা সংগ্রহ করি:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                          <li>আপনার জমা দেওয়া দাবি (টেক্সট)</li>
                          <li>ঐচ্ছিক: ছবি, URL, বিভাগ</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-2">আমরা যা সংগ্রহ করি না:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                           <li>নাম, ইমেইল, ফোন নম্বর</li>
                           <li>কোনো ব্যক্তিগত পরিচয় তথ্য</li>
                        </ul>
                      </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-purple-100 mt-2">
                    <p className="font-bold text-purple-800 mb-1">🔒 নিরাপত্তা ব্যবস্থা:</p>
                    <p className="text-sm text-gray-600">সব ডেটা এনক্রিপ্টেড (SSL/TLS) থাকে। আমরা কোনো তথ্য বিক্রয় বা তৃতীয় পক্ষের সাথে শেয়ার করি না।</p>
                  </div>
                </div>
              </section>

              {/* Section 9 - Content Moderation */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ৯. কন্টেন্ট মডারেশন
                </h2>
                <p className="leading-relaxed mb-4 text-gray-600">
                  সব রিপোর্ট আমাদের মডারেশন টিম দ্বারা পর্যালোচনা হয় (সাধারণত ২৪ ঘন্টার মধ্যে)।
                </p>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                   <p className="font-bold text-red-700 mb-2">প্রত্যাখ্যাত হবে:</p>
                   <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
                      <li>ব্যক্তিগত আক্রমণ বা গালিগালাজ</li>
                      <li>হিংসার উস্কানি বা রাজনৈতিক প্রোপাগান্ডা</li>
                      <li>স্প্যাম বা বিজ্ঞাপন</li>
                   </ul>
                </div>
              </section>

              {/* Section 10 - Legal Compliance */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ১০. আইনি সম্মতি
                </h2>
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    এই সেবা বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত।
                  </p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                    <strong>সতর্কতা:</strong> গুরুতর আইন লঙ্ঘন (যেমন: শিশু নির্যাতন, সন্ত্রাসবাদী বিষয়বস্তু, মৃত্যুর হুমকি) অবিলম্বে সংশ্লিষ্ট কর্তৃপক্ষের কাছে রিপোর্ট করা হবে।
                  </p>
                </div>
              </section>

              {/* Section 11 - Intellectual Property */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ১১. মেধা সম্পত্তি
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                   আপনার জমা দেওয়া রিপোর্টের মালিকানা আপনার থাকে। তবে, জমা দিয়ে আপনি SattyoAlert-কে এটি যাচাইকরণ ও প্রদর্শনের অনুমতি দিচ্ছেন। আমাদের তৈরি গ্রাফিক্স ও কন্টেন্ট শিক্ষামূলক উদ্দেশ্যে বিনামূল্যে ব্যবহার করা যেতে পারে।
                </p>
              </section>

              {/* Section 12 - Service Changes */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ১২. সেবা পরিবর্তন
                </h2>
                <p className="text-base text-gray-700">
                  আমরা যেকোনো সময় সেবা পরিবর্তন, স্থগিত বা বন্ধ করার অধিকার সংরক্ষণ করি। স্থায়ীভাবে বন্ধ হলে আমরা নোটিশ দেওয়ার চেষ্টা করব।
                </p>
              </section>

              {/* Section 13 - Dispute Resolution */}
              <section className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3">
                  ১৩. বিরোধ নিষ্পত্তি
                </h2>
                <p className="text-base text-gray-700 mb-2">
                  যেকোনো অভিযোগের জন্য প্রথমে আমাদের সাথে যোগাযোগ করুন।
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 font-medium">
                   <li>ইমেইল: contact@sattyoalert.com</li>
                   <li>সাড়া সময়: ৭ কর্মদিবস</li>
                   <li>এখতিয়ার: ঢাকা, বাংলাদেশ</li>
                </ul>
              </section>

              {/* Section 14 - Emergency Situations */}
              <section className="bg-red-50 border-2 border-red-100 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                  <AlertTriangle className="fill-red-100 text-red-600" /> ১৪. জরুরি পরিস্থিতি
                </h2>
                <div className="space-y-4">
                  <div className="text-center font-bold text-red-900 text-lg bg-red-100/50 p-2 rounded-lg">
                    SattyoAlert জরুরি সেবা নয়!
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-red-100">
                    <p className="mb-3 font-semibold text-gray-900">প্রয়োজনীয় জরুরি নম্বরসমূহ:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base text-gray-700">
                      <li className="flex items-center gap-2"><span className="bg-red-100 px-2 rounded text-red-800 font-bold">999</span> জাতীয় জরুরি সেবা</li>
                      <li className="flex items-center gap-2"><span className="bg-red-100 px-2 rounded text-red-800 font-bold">109</span> নারী ও শিশু নির্যাতন</li>
                      <li className="flex items-center gap-2"><span className="bg-red-100 px-2 rounded text-red-800 font-bold">1098</span> শিশু সহায়তা</li>
                      <li className="flex items-center gap-2"><span className="bg-red-100 px-2 rounded text-red-800 font-bold">Cyber</span> 01320001010</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 15 - Children's Safety */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ১৫. শিশুদের নিরাপত্তা
                </h2>
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                   <p className="text-base text-teal-900">
                     আমরা ১৩ বছরের কম বয়সীদের কোনো ডেটা সংগ্রহ করি না। শিশু যৌন নির্যাতন সামগ্রী (CSAM) আমাদের প্ল্যাটফর্মে কঠোরভাবে নিষিদ্ধ এবং অবিলম্বে রিপোর্ট করা হবে।
                   </p>
                </div>
              </section>

              {/* Section 16 - Accessibility */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ১৬. প্রবেশযোগ্যতা (Accessibility)
                </h2>
                <p className="leading-relaxed mb-3 text-base text-gray-700">
                  আমরা সবার জন্য প্রবেশযোগ্য প্ল্যাটফর্ম তৈরি করতে প্রতিশ্রুতিবদ্ধ (WCAG 2.1 AA স্ট্যান্ডার্ড)।
                </p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded inline-block">
                  প্রবেশযোগ্যতা সমস্যা থাকলে accessibility@sattyoalert.com এ জানান।
                </p>
              </section>

              {/* Section 17 - Terms Updates */}
              <section className="pl-2">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ১৭. শর্তাবলী আপডেট
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                   আমরা সময়ে সময়ে এই শর্তাবলী আপডেট করতে পারি। বড় পরিবর্তনের ক্ষেত্রে ৩০ দিনের নোটিশ দেওয়া হবে। আপডেটের পর ব্যবহার অব্যাহত রাখলে নতুন শর্তাবলী মেনে নেওয়া হয়েছে বলে গণ্য হবে।
                </p>
              </section>

              {/* Section 18 - Contact & Support */}
              <section className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ১৮. যোগাযোগ ও সহায়তা
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                    <p className="font-bold text-purple-900 mb-2">📧 সাধারণ যোগাযোগ</p>
                    <p className="text-base text-gray-700 font-mono">contact@sattyoalert.com</p>
                    <p className="text-xs text-gray-500 mt-2">সাড়া সময়: ২৪-৪৮ ঘন্টা</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-xl border border-red-100 hover:shadow-md transition-shadow">
                    <p className="font-bold text-red-900 mb-2">🚨 নিরাপত্তা রিপোর্ট</p>
                    <p className="text-base text-gray-700 font-mono">security@sattyoalert.com</p>
                    <p className="text-xs text-gray-500 mt-2">সাড়া সময়: ১২ ঘন্টা</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                   অফিস: SattyoAlert, ঢাকা, বাংলাদেশ
                </div>
              </section>

              {/* Final Acknowledgment */}
              <section className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 p-8 rounded-2xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📜 সম্মতি বিবৃতি
                </h2>
                <p className="text-lg text-gray-800 italic leading-relaxed max-w-2xl mx-auto">
                  &quot;আমি নিশ্চিত করছি যে আমি উপরের সব শর্তাবলী পড়েছি এবং মেনে নিচ্ছি। 
                  আমি বুঝি যে SattyoAlert একটি তথ্য সংযোগকারী প্ল্যাটফর্ম।&quot;
                </p>
                <div className="mt-6 flex justify-center">
                   <div className="h-1 w-24 bg-red-300 rounded-full"></div>
                </div>
              </section>

              {/* Last Updated */}
              <div className="pt-8 mt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  সর্বশেষ আপডেট: ৭ ডিসেম্বর, ২০২৫ | সংস্করণ: ২.০
                </p>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-12 text-center">
              <button
                onClick={() => window.history.back()}
                className="bg-red-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 transform hover:-translate-y-1"
              >
                ← ফিরে যান
              </button>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}