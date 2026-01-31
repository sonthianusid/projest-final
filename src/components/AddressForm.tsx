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

    if (loading) return <div className="text-gray-400 text-sm">กำลังโหลดข้อมูลที่อยู่...</div>;

    return (
        <div className="space-y-4">
            {/* Detail: House No, Village, Road */}
            <div className="relative z-0 w-full group">
                <input
                    type="text"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-black/20 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 transition-all duration-300"
                    placeholder=" "
                />
                <label className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6">
                    บ้านเลขที่ / หมู่ / ซอย / ถนน
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {/* Province */}
                <div className="relative">
                    <label className="text-[10px] text-gray-500 mb-1 block">จังหวัด</label>
                    <div className="relative">
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full bg-black/20 text-white text-sm border border-white/5 rounded-xl px-3 focus:outline-none focus:border-[#667eea]/50 focus:ring-2 focus:ring-[#667eea]/10 appearance-none truncate h-[46px] transition-all duration-300"
                            style={{ lineHeight: 'normal' }} // Reset line-height for select
                        >
                            <option value="">เลือก</option>
                            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Amphoe */}
                <div className="relative">
                    <label className="text-[10px] text-gray-500 mb-1 block">อำเภอ</label>
                    <div className="relative">
                        <select
                            value={amphoe}
                            onChange={(e) => setAmphoe(e.target.value)}
                            disabled={!province}
                            className="w-full bg-[#1a1a2e] text-white text-sm border border-gray-700 rounded-lg px-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50 appearance-none truncate h-[38px] leading-[38px] py-0"
                            style={{ lineHeight: 'normal' }}
                        >
                            <option value="">เลือก</option>
                            {amphoes.map(ONE => <option key={ONE} value={ONE}>{ONE}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Tambon */}
                <div className="relative">
                    <label className="text-[10px] text-gray-500 mb-1 block">ตำบล</label>
                    <div className="relative">
                        <select
                            value={tambon}
                            onChange={(e) => setTambon(e.target.value)}
                            disabled={!amphoe}
                            className="w-full bg-[#1a1a2e] text-white text-sm border border-gray-700 rounded-lg px-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50 appearance-none truncate h-[38px] leading-[38px] py-0"
                            style={{ lineHeight: 'normal' }}
                        >
                            <option value="">เลือก</option>
                            {tambons.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Zipcode */}
                <div className="relative">
                    <label className="text-[10px] text-gray-500 mb-1 block">รหัสปณ.</label>
                    <input
                        type="text"
                        value={zipcode}
                        readOnly
                        className="w-full bg-white/5 text-gray-400 text-sm border border-white/5 rounded-xl px-3 focus:outline-none cursor-not-allowed h-[46px] flex items-center"
                    />
                </div>
            </div>
        </div>
    );
}
