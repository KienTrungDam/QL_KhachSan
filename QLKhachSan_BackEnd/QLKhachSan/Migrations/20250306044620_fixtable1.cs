using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class fixtable1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AspNetUsers_PersonId1",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_PersonId1",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PersonId1",
                table: "Bookings");

            migrationBuilder.AlterColumn<string>(
                name: "PersonId",
                table: "Bookings",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_PersonId",
                table: "Bookings",
                column: "PersonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AspNetUsers_PersonId",
                table: "Bookings",
                column: "PersonId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AspNetUsers_PersonId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_PersonId",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "PersonId",
                table: "Bookings",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "PersonId1",
                table: "Bookings",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_PersonId1",
                table: "Bookings",
                column: "PersonId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AspNetUsers_PersonId1",
                table: "Bookings",
                column: "PersonId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
