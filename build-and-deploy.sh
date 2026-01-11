#!/bin/bash

# سكريبت لبناء ونشر التطبيق

echo "🚀 بناء ونشر تطبيق Atayb"
echo "=========================="

# التحقق من وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker غير مثبت. الرجاء تثبيت Docker أولاً."
    exit 1
fi

# طلب اسم المستخدم على Docker Hub (اختياري)
read -p "هل تريد رفع الصورة إلى Docker Hub؟ (y/n): " UPLOAD_TO_HUB

IMAGE_NAME="atayb-app:latest"

# بناء الصورة
echo ""
echo "🔨 بناء صورة Docker..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "❌ فشل بناء الصورة"
    exit 1
fi

echo "✅ تم بناء الصورة بنجاح"

# رفع الصورة إلى Docker Hub (اختياري)
if [ "$UPLOAD_TO_HUB" = "y" ]; then
    read -p "أدخل اسم مستخدم Docker Hub: " DOCKER_USERNAME
    
    if [ -z "$DOCKER_USERNAME" ]; then
        echo "⚠️  لم يتم إدخال اسم المستخدم، تخطي الرفع"
    else
        echo ""
        echo "📤 رفع الصورة إلى Docker Hub..."
        
        # تسجيل الدخول
        docker login
        
        # وضع tag للصورة
        docker tag $IMAGE_NAME $DOCKER_USERNAME/atayb-app:latest
        
        # رفع الصورة
        docker push $DOCKER_USERNAME/atayb-app:latest
        
        if [ $? -eq 0 ]; then
            echo "✅ تم رفع الصورة بنجاح"
            echo "📝 استخدم هذه الصورة في Portainer: $DOCKER_USERNAME/atayb-app:latest"
        else
            echo "❌ فشل رفع الصورة"
        fi
    fi
fi

echo ""
echo "🎉 اكتمل الإعداد!"
echo ""
echo "📋 الخطوات التالية:"
echo "1. افتح Portainer"
echo "2. اذهب إلى Stacks > Add Stack"
echo "3. انسخ محتوى docker-compose.yml"
echo "4. أضف المتغيرات البيئية من .env.portainer"
echo "5. اضغط Deploy"
echo ""
echo "📖 لمزيد من التفاصيل، راجع ملف PORTAINER_DEPLOY.md"
