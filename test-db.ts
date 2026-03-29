import { PrismaClient } from "@prisma/client";

async function testConnection() {
  const prisma = new PrismaClient();
  try {
    console.log("正在尝试连接到数据库...");
    // 尝试执行一个简单的查询
    await prisma.$connect();
    console.log("✅ 数据库连接成功！");
    
    const count = await prisma.prompt.count();
    console.log(`📊 当前数据库中有 ${count} 条 Prompt 记录。`);
  } catch (error) {
    console.error("❌ 数据库连接失败！");
    if (error instanceof Error) {
      console.error("错误详情:", error.message);
    } else {
      console.error("未知错误:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
