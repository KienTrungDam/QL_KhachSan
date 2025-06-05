using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class DeleteResort : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Resorts_ResortId",
                table: "Rooms");

            migrationBuilder.DropTable(
                name: "Resorts");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_ResortId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "ResortId",
                table: "Rooms");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResortId",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Resorts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rate = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resorts", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Resorts",
                columns: new[] { "Id", "Address", "Name", "PhoneNumber", "Rate" },
                values: new object[,]
                {
                    { 1, "123", "Resort 1", "123", 5 },
                    { 2, "123", "Resort 2", "123", 4 },
                    { 3, "123", "Resort 3", "123", 2 },
                    { 4, "123", "Resort 4", "123", 1 }
                });

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 1,
                column: "ResortId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 2,
                column: "ResortId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 3,
                column: "ResortId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 4,
                column: "ResortId",
                value: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_ResortId",
                table: "Rooms",
                column: "ResortId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Resorts_ResortId",
                table: "Rooms",
                column: "ResortId",
                principalTable: "Resorts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
