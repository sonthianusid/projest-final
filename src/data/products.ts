export interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number;
    image: string;
    isNew: boolean;
    description?: string;
}

export const allProducts: Product[] = [
    {
        id: 1,
        name: 'Nike Air Max 270',
        brand: 'nike',
        category: 'running',
        price: 5990,
        originalPrice: 7990,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        isNew: true,
        description: 'รองเท้า Nike Air Max 270 มอบความนุ่มสบายที่เหนือกว่าด้วยส่วน Max Air ขนาดใหญ่ที่สุดเท่าที่เคยมีมา รองเท้ารุ่นนี้โดดเด่นด้วยสีสันสดใสและการออกแบบที่ล้ำสมัย เหมาะสำหรับการสวมใส่ในชีวิตประจำวันหรือการออกกำลังกายเบาๆ'
    },
    {
        id: 2,
        name: 'Nike Air Jordan 1 Retro',
        brand: 'nike',
        category: 'basketball',
        price: 7990,
        originalPrice: 9990,
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500',
        isNew: false,
        description: 'ตำนานที่ยังมีลมหายใจ Air Jordan 1 Retro นำเสนอสไตล์คลาสสิกที่ไม่มีวันตกยุค พร้อมหนังคุณภาพระดับพรีเมียมและการรองรับข้อเท้าที่ดีเยี่ยม เป็นไอเท็มที่นักสะสมและแฟนบาสเก็ตบอลต้องมี'
    },
    {
        id: 3,
        name: 'Nike Air Force 1 Low',
        brand: 'nike',
        category: 'lifestyle',
        price: 4290,
        originalPrice: 5290,
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
        isNew: false,
        description: 'ไอคอนแห่งวงการสตรีทแฟชั่น Nike Air Force 1 Low ยังคงความคลาสสิกด้วยดีไซน์ที่เรียบง่ายแต่โดดเด่น พื้นรองเท้าที่ทนทานและความสบายที่ยอดเยี่ยมทำให้เป็นรองเท้าคู่โปรดของใครหลายคน'
    },
    {
        id: 4,
        name: 'Nike Dunk Low Panda',
        brand: 'nike',
        category: 'lifestyle',
        price: 5490,
        originalPrice: 6990,
        image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500',
        isNew: true,
        description: 'รองเท้ายอดฮิตแห่งยุค Nike Dunk Low ในโทนสีขาวดำ "Panda" ที่แมตช์ได้กับทุกชุด ดีไซน์ข้อต่ำที่สวมใส่สบายและสไตล์วินเทจที่กลับมาได้รับความนิยมอย่างถล่มทลาย'
    },
    {
        id: 5,
        name: 'Nike ZoomX Vaporfly',
        brand: 'nike',
        category: 'running',
        price: 8990,
        originalPrice: 10990,
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500',
        isNew: true,
        description: 'รองเท้าวิ่งสายทำความเร็ว Nike ZoomX Vaporfly มาพร้อมโฟม ZoomX ที่ดีดตัวได้ดีที่สุดและแผ่นคาร์บอนไฟเบอร์ที่ช่วยส่งแรง เหมาะสำหรับนักวิ่งที่ต้องการทำลายสถิติของตัวเอง'
    },
    {
        id: 6,
        name: 'Adidas Ultraboost 22',
        brand: 'adidas',
        category: 'running',
        price: 6490,
        originalPrice: 8490,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
        isNew: false,
        description: 'สัมผัสประสบการณ์การวิ่งที่นุ่มนวลที่สุดกับ Adidas Ultraboost 22 ด้วยเทคโนโลยี Boost ที่อัดแน่นเต็มพื้นรองเท้า พร้อมส่วนบน Primeknit ที่กระชับและระบายอากาศได้ดีเยี่ยม'
    },
    {
        id: 7,
        name: 'Adidas NMD R1',
        brand: 'adidas',
        category: 'lifestyle',
        price: 5490,
        originalPrice: 6990,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
        isNew: false,
        description: 'การผสมผสานระหว่างสไตล์เรโทรและเทคโนโลยีสมัยใหม่ Adidas NMD R1 โดดเด่นด้วยปลั๊ก EVA ที่เป็นเอกลักษณ์และพื้น Boost ที่มอบความสบายตลอดวัน'
    },
    {
        id: 8,
        name: 'Adidas Stan Smith',
        brand: 'adidas',
        category: 'lifestyle',
        price: 3990,
        originalPrice: 4990,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500',
        isNew: false,
        description: 'ความเรียบง่ายที่ครองใจคนทั่วโลกมากว่า 50 ปี Adidas Stan Smith คือรองเท้าเทนนิสสุดคลาสสิกที่เข้าได้กับทุกสไตล์ ไม่ว่าจะเป็นลุคทางการหรือลำลอง'
    },
    {
        id: 9,
        name: 'Adidas Yeezy Boost 350',
        brand: 'adidas',
        category: 'lifestyle',
        price: 12990,
        originalPrice: 15990,
        image: 'https://images.unsplash.com/photo-1491553895911-0055uj8hb0aa?w=500',
        isNew: true,
        description: 'ผลงานการออกแบบระดับไอคอน Adidas Yeezy Boost 350 นำเสนอดีไซน์ที่ล้ำสมัยและความสบายจากพื้น Boost เป็น must-have item สำหรับสายสตรีท'
    },
    {
        id: 10,
        name: 'Adidas Superstar',
        brand: 'adidas',
        category: 'lifestyle',
        price: 3490,
        originalPrice: 4490,
        image: 'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=500',
        isNew: false,
        description: 'ต้นกำเนิดจากสนามบาสเก็ตบอลสู่ตำนานฮิปฮอป Adidas Superstar โดดเด่นด้วยหัวรองเท้ารูปเปลือกหอย (Shell Toe) และแถบ 3-Stripes ที่เป็นเอกลักษณ์'
    },
    {
        id: 11,
        name: 'Adidas Forum Low',
        brand: 'adidas',
        category: 'basketball',
        price: 4290,
        originalPrice: 5290,
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500',
        isNew: true,
        description: 'สไตล์บาสเก็ตบอลยุค 80 กลับมาอีกครั้ง Adidas Forum Low นำเสนอดีไซน์ข้อต่ำพร้อมสายรัดข้อเท้าที่เป็นเอกลักษณ์ มอบลุควินเทจที่เท่และมีสไตล์'
    },
    {
        id: 12,
        name: 'Nike Blazer Mid',
        brand: 'nike',
        category: 'lifestyle',
        price: 4790,
        originalPrice: 5790,
        image: 'https://images.unsplash.com/photo-1612902456551-e1e5e5c5c521?w=500',
        isNew: false,
        description: 'รองเท้าบาสเก็ตบอลรุ่นบุกเบิกของ Nike Blazer Mid ' + "'77" + ' Vintage ยังคงเสน่ห์ความคลาสสิกไว้ครบถ้วน ด้วยดีไซน์หุ้มข้อและโลโก้ Swoosh ขนาดใหญ่'
    },
];
