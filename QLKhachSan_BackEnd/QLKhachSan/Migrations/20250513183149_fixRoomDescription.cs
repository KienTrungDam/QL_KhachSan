using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class fixRoomDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "View: biển, núi, có cửa sổ ngắm biển");

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "View: biển, núi, có cửa sổ ngắm biển");

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 3,
                column: "Description",
                value: "View: biển, núi, có cửa sổ ngắm biển");

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 4,
                column: "Description",
                value: "View: biển, núi, có cửa sổ ngắm biển");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Rooms");
        }
    }
}
