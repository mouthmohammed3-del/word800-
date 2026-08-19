# WordPlay 800

اريد لعبه لتعلم ال 800 كلمه 

<!DOCTYPE html>
<html dir="ltr" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>800 كلمة إنجليزية - مع النطق</title>
    <style>
        /* التصميم العام */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(145deg, #f0f4ff 0%, #d9e4f5 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            border-radius: 40px;
            padding: 25px 30px 40px;
            box-shadow: 0 20px 60px rgba(0, 20, 50, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }

        h1 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: #1a2b4c;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        h1 small {
            font-size: 1rem;
            font-weight: 400;
            color: #4a5b7a;
            background: rgba(255,255,255,0.6);
            padding: 6px 18px;
            border-radius: 40px;
        }

        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin: 20px 0 25px;
            justify-content: center;
            align-items: center;
        }

        .search-box {
            flex: 1 1 280px;
            position: relative;
        }
        .search-box input {
            width: 100%;
            padding: 14px 20px;
            border: none;
            border-radius: 60px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            font-size: 1rem;
            outline: 2px solid transparent;
            transition: 0.3s;
        }
        .search-box input:focus {
            outline-color: #2a4b7c;
            box-shadow: 0 8px 20px rgba(42, 75, 124, 0.15);
        }

        .btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }

        .btn {
            padding: 10px 18px;
            border: none;
            border-radius: 40px;
            background: white;
            color: #1a2b4c;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .btn:hover {
            transform: translateY(-2px);
            background: #f0f6ff;
        }
        .btn.active {
            background: #1a2b4c;
            color: white;
            box-shadow: 0 6px 16px rgba(26, 43, 76, 0.25);
        }
        .btn.toggle-ar {
            background: #ffd966;
            color: #1a2b4c;
        }
        .btn.toggle-ar:hover {
            background: #f7c948;
        }

        .stats {
            text-align: center;
            font-size: 0.95rem;
            color: #3d4f6e;
            margin-bottom: 20px;
            font-weight: 500;
        }

        /* شبكة البطاقات */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
        }

        .card {
            background: white;
            border-radius: 20px;
            padding: 18px 14px 14px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
            border: 1px solid rgba(255,255,255,0.8);
            transition: 0.25s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            cursor: default;
            backdrop-filter: blur(4px);
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 16px 30px rgba(26, 43, 76, 0.08);
            border-color: #b4c8e0;
        }

        .card .num {
            font-size: 0.7rem;
            font-weight: 600;
            color: #a0b5d0;
            background: #f0f5fe;
            padding: 2px 12px;
            border-radius: 40px;
            margin-bottom: 6px;
            letter-spacing: 0.3px;
        }

        .card .en {
            font-size: 1.3rem;
            font-weight: 700;
            color: #0b1d38;
            margin: 4px 0 6px;
            word-break: break-word;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 4px 12px;
            border-radius: 40px;
            transition: 0.2s;
            background: rgba(0, 0, 0, 0.02);
        }
        .card .en:hover {
            background: #dbe7fa;
            color: #001f3f;
        }
        .card .en .speaker-icon {
            font-size: 1.1rem;
            opacity: 0.7;
            transition: 0.2s;
        }
        .card .en:hover .speaker-icon {
            opacity: 1;
            transform: scale(1.1);
        }

        .card .ar {
            font-size: 1.1rem;
            color: #2d4b74;
            background: #f2f8ff;
            padding: 5px 14px;
            border-radius: 30px;
            margin-top: 4px;
            transition: 0.3s;
            font-weight: 500;
            min-height: 2.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        .card .ar.hidden {
            filter: blur(6px);
            background: #e9edf3;
            color: transparent;
            user-select: none;
        }
        .card .ar.hidden::after {
            content: "👁️ اضغط للظهور";
            filter: blur(0);
            color: #687a99;
            font-size: 0.8rem;
            font-weight: 400;
        }
        /* عند النقر على البطاقة نظهر الترجمة مؤقتاً */
        .card.reveal .ar.hidden {
            filter: blur(0);
            color: #2d4b74;
            background: #e1efff;
        }
        .card.reveal .ar.hidden::after {
            content: none;
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin: 35px 0 10px;
            flex-wrap: wrap;
        }
        .pagination .btn {
            min-width: 100px;
        }
        .pagination span {
            font-weight: 600;
            color: #1a2b4c;
            background: white;
            padding: 8px 24px;
            border-radius: 40px;
            font-size: 0.95rem;
        }

        .footer-meta {
            text-align: center;
            margin-top: 25px;
            font-size: 0.8rem;
            color: #6b7f9e;
            border-top: 1px solid rgba(255,255,255,0.5);
            padding-top: 20px;
        }

        @media (max-width: 600px) {
            .container { padding: 15px; }
            h1 { font-size: 1.8rem; }
            .cards-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
            .card .en { font-size: 1.1rem; }
        }
    






    


        📚 800 كلمة أساسية
        مع النطق 🔊
    



    


        


            
        


        🔁 إخفاء الترجمة
    



    


        الكل (800)
        1-50
        51-100
        101-150
        151-200
        201-250
        251-300
        301-350
        351-400
        401-450
        451-500
        501-550
        551-600
        601-650
        651-700
        701-750
        751-800
    



    

عرض 800 كلمة



    



    


        ⬅ السابق
        الصفحة 1 من 40
        التالي ➡
    


    


        ✧ اضغط على الكلمة الإنجليزية أو 🔊 لسماع النطق · اضغط على البطاقة لإظهار الترجمة (في وضع الإخفاء) ✧

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://moathalyaari800word.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aadafce5-d490-449e-a03d-cfc2b5bd2783).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
