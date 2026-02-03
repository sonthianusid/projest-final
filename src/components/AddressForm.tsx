'use client';

import { useState, useEffect } from 'react';

interface ThaiAddressData {
    district: string; // Tambon
    amphoe: string;   // Amphoe
    province: string; // Province
    zipcode: number;
}

interface AddressFormProps {
    onAddressChange: (fullAddress: string) => void;
    initialAddress?: string;
}

export default function AddressForm({ onAddressChange, initialAddress }: AddressFormProps) {
    const [db, setDb] = useState<ThaiAddressData[]>([]);
    const [loading, setLoading] = useState(true);

    // Selections
    const [province, setProvince] = useState('');
    const [amphoe, setAmphoe] = useState('');
    const [tambon, setTambon] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [detail, setDetail] = useState(''); // House no, moo, road

    // Options
    const [provinces, setProvinces] = useState<string[]>([]);
    const [amphoes, setAmphoes] = useState<string[]>([]);
    const [tambons, setTambons] = useState<string[]>([]);

    useEffect(() => {
        // Load Thai address database
        fetch('https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json')
            .then(res => res.json())
            .then((data: ThaiAddressData[]) => {
                setDb(data);
                // Extract unique provinces
                const uniqueProvinces = Array.from(new Set(data.map(item => item.province))).sort();
                setProvinces(uniqueProvinces);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load address data', err);
                setLoading(false);
            });
    }, []);

    // Initialize with initialAddress
    useEffect(() => {
        if (initialAddress && db.length > 0) {
            // Match format: "Detail ต.Tambon อ.Amphoe จ.Province Zipcode"
            // Note: Detail can contain anything. We rely on the suffixes.
            const match = initialAddress.match(/^(.*) ต\.(.+) อ\.(.+) จ\.(.+) (\d{5})$/);
            if (match) {
                setDetail(match[1]);
                setProvince(match[4]);
                setAmphoe(match[3]);
                setTambon(match[2]);
                setZipcode(match[5]);
            } else {
                // formatting fallback: put everything in detail if regex fails?
                // Or try simpler split? Better to just set Detail if generic.
                if (!detail && !province) {
                    setDetail(initialAddress);
                }
            }
        }
    }, [initialAddress, db]); // Only run when initialAddress provided and db loaded

    // Update parts when Province changes
    useEffect(() => {
        if (!province) {
            setAmphoes([]);
            setTambons([]);
            return;
        }
        const relevant = db.filter(item => item.province === province);
        const uniqueAmphoes = Array.from(new Set(relevant.map(item => item.amphoe))).sort();
        setAmphoes(uniqueAmphoes);

        // Smarter clear: only clear if current amphoe is not in new list
        setAmphoe(prev => uniqueAmphoes.includes(prev) ? prev : '');
    }, [province, db]);

    // Update parts when Amphoe changes
    useEffect(() => {
        if (!amphoe) {
            setTambons([]);
            return;
        }
        const relevant = db.filter(item => item.province === province && item.amphoe === amphoe);
        const uniqueTambons = Array.from(new Set(relevant.map(item => item.district))).sort();
        setTambons(uniqueTambons);

        // Smarter clear
        setTambon(prev => uniqueTambons.includes(prev) ? prev : '');
    }, [amphoe, province, db]);

    // Update Zipcode when Tambon changes (auto-fill)
    useEffect(() => {
        if (!tambon) return;
        const entry = db.find(item => item.province === province && item.amphoe === amphoe && item.district === tambon);
        if (entry) {
            setZipcode(entry.zipcode.toString());
        }
    }, [tambon, amphoe, province, db]);

    // Combine address whenever any part changes
    useEffect(() => {
        if (detail && province && amphoe && tambon && zipcode) {
            const full = `${detail} ต.${tambon} อ.${amphoe} จ.${province} ${zipcode}`;
            // Avoid loop if parent updates initialAddress? 
            // Parent normally passes user.address which comes from DB/Context. 
            // Ideally parent uses local state for form.
            onAddressChange(full);
        } else if (province || amphoe || tambon) {
            // Partial address? Don't emit incomplete strict format, or emit partially?
            // Existing logic emitted empty if not full.
            onAddressChange(`${detail} ${province ? 'จ.' + province : ''} ...`); // Just kidding, stick to simple logic or allow partial
            // Stick to original behavior: empty until full cascade complete?
            // But if editing, we might want to allow partial updates?
            // No, validation requires valid address.
        }
    }, [detail, province, amphoe, tambon, zipcode, onAddressChange]);

    if (loading) return <div className="text-gray-400 text-sm animate-pulse">กำลังโหลดข้อมูลที่อยู่...</div>;

    return (
        <div className="space-y-6">
            {/* Detail: House No, Village, Road */}
            <div className="relative z-0 w-full group">
                <input
                    type="text"
                    value={detail}
                    id="address_detail"
                    onChange={(e) => setDetail(e.target.value)}
                    className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-8"
                    placeholder=" "
                />
                <label htmlFor="address_detail" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                    บ้านเลขที่ / หมู่ / ซอย / ถนน
                </label>
                <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Province */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">จังหวัด</label>
                    <div className="relative group/select">
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="appearance-none text-white text-base font-bold outline-none transition-all cursor-pointer w-full text-left"
                            style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '0',
                                padding: '12px 32px 12px 8px',
                                backgroundImage: 'none'
                            }}
                        >
                            <option value="" className="bg-[#121214]">เลือกจังหวัด</option>
                            {provinces.map(p => <option key={p} value={p} className="bg-[#121214]">{p}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-indigo-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Amphoe */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">อำเภอ</label>
                    <div className="relative group/select">
                        <select
                            value={amphoe}
                            onChange={(e) => setAmphoe(e.target.value)}
                            disabled={!province}
                            className="appearance-none text-white text-base font-bold outline-none transition-all cursor-pointer w-full text-left disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '0',
                                padding: '12px 32px 12px 8px',
                                backgroundImage: 'none'
                            }}
                        >
                            <option value="" className="bg-[#121214]">เลือกอำเภอ</option>
                            {amphoes.map(ONE => <option key={ONE} value={ONE} className="bg-[#121214]">{ONE}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-indigo-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Tambon */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">ตำบล</label>
                    <div className="relative group/select">
                        <select
                            value={tambon}
                            onChange={(e) => setTambon(e.target.value)}
                            disabled={!amphoe}
                            className="appearance-none text-white text-base font-bold outline-none transition-all cursor-pointer w-full text-left disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '0',
                                padding: '12px 32px 12px 8px',
                                backgroundImage: 'none'
                            }}
                        >
                            <option value="" className="bg-[#121214]">เลือกตำบล</option>
                            {tambons.map(t => <option key={t} value={t} className="bg-[#121214]">{t}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-indigo-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Zipcode */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">รหัสไปรษณีย์</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={zipcode}
                            readOnly
                            className="w-full h-[54px] bg-white/[0.03] text-white text-lg border border-white/10 rounded-2xl px-4 outline-none cursor-not-allowed flex items-center"
                            placeholder=""
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
